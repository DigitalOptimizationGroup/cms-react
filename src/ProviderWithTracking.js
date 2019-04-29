import * as React from "react";
import { connect } from "@digitaloptgroup/cms";
import { Context } from "./Context";

export class ProviderWithTracking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      observeStack: [],
      pathChangeStack: [],
      caughtErrorStack: [],
      outcomeStack: []
    };
  }

  componentDidMount() {
    const cms = connect({
      projectId: this.props.projectId,
      apikey: this.props.apikey,
      apiUrl: this.props.apiUrl
    });

    this.setState({
      cms
    });

    import("@digitaloptgroup/analytics")
      .then(module => {
        const { initTracker } = module;
        const {
          pathChange,
          outcome,
          caughtError,
          initIntersectionObserver
        } = initTracker(
          {
            rid: this.props.rid,
            vid: this.props.vid,
            projectId: this.props.projectId,
            startTimestamp: this.props.startTimestamp,
            apiKey: this.props.apiKey
          },
          this.props.wsFqdn
        );

        const { observe, unobserve } = initIntersectionObserver();

        this.state.observeStack.forEach(({ element, tracking }) => {
          observe(element, tracking);
        });

        this.state.pathChangeStack.forEach(pathname => {
          pathChange(pathname);
        });

        this.state.outcomeStack.forEach(({ name, metadata }) => {
          outcome(name, metadata);
        });

        this.state.caughtErrorStack.forEach(metadata => {
          caughtError(metadata);
        });

        this.setState({
          pathChange,
          outcome,
          caughtError,
          observe,
          unobserve,
          observeStack: [],
          pathChangeStack: [],
          outcomeStack: [],
          caughtErrorStack: []
        });
      })
      .catch(e => {
        // should send this error somewhere
        console.log("failed importing", e);
      });
  }

  observe = (element, tracking) => {
    if (this.state.observe) {
      this.state.observe(element, tracking);
    } else {
      this.setState({
        observeStack: [...this.state.observeStack, { element, tracking }]
      });
    }
  };

  unobserve = element => {
    if (this.state.unobserve) {
      this.state.unobserve(element);
    } else {
      this.setState({
        observeStack: this.state.observeStack.filter(
          variation => element !== variation.element
        )
      });
    }
  };

  pathChange = pathname => {
    if (this.state.pathChange) {
      this.state.pathChange(pathname);
    } else {
      this.setState({
        pathChangeStack: [...this.state.pathChangeStack, pathname]
      });
    }
  };

  outcome = (name, metadata) => {
    if (this.state.outcome) {
      this.state.outcome(name, metadata);
    } else {
      this.setState({
        outcomeStack: [...this.state.outcomeStack, { name, metadata }]
      });
    }
  };

  caughtError = metadata => {
    if (this.state.caughtError) {
      this.state.caughtError(metadata);
    } else {
      this.setState({
        caughtErrorStack: [...this.state.caughtErrorStack, metadata]
      });
    }
  };

  render() {
    return (
      <Context.Provider
        value={{
          cms: this.state.cms,
          pathChange: this.pathChange,
          outcome: this.state.outcome,
          caughtError: this.state.caughtError,
          observe: this.observe,
          unobserve: this.unobserve
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}
