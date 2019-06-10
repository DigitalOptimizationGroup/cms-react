import * as React from "react";
import { connect } from "@digitaloptgroup/cms";
import { Context } from "./Context";
//import { initTracker } from "@digitaloptgroup/analytics";

export class ProviderWithTracking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.observeStack = [];
    this.pathChangeStack = [];
    this.caughtErrorStack = [];
    this.outcomeStack = [];
  }

  componentDidMount() {
    const cms = connect({
      apikey: this.props.apikey,
      apiUrl: this.props.apiUrl,
      vid: this.props.vid,
      realtimeUrl: this.props.realtimeUrl
    });

    this.setState({
      cms
    });

    import("@digitaloptgroup/analytics").then(tracker => {
      this.initTracker(tracker, this.props);
    });

    //    if(this.props.tracker)
  }

  initTracker = (tracker, props) => {
    const { initTracker } = tracker;
    const {
      pathChange,
      outcome,
      caughtError,
      initIntersectionObserver
    } = initTracker(
      {
        rid: props.rid,
        vid: props.vid,
        projectId: props.projectId,
        startTimestamp: props.startTimestamp,
        apiKey: props.apiKey
      },
      this.props.wsFqdn
    );

    const { observe, unobserve } = initIntersectionObserver();

    while (this.observeStack.length > 0) {
      const { element, tracking } = this.observeStack.shift();
      observe(element, tracking);
    }

    while (this.pathChangeStack.length > 0) {
      const pathname = this.pathChangeStack.shift();
      pathChange(pathname);
    }

    while (this.outcomeStack.length > 0) {
      const { name, metadata } = this.outcomeStack.shift();
      outcome(name, metadata);
    }

    while (this.caughtErrorStack.length > 0) {
      const metadata = this.caughtErrorStack.shift();
      observe(metadata);
    }

    this.setState({
      pathChange,
      outcome,
      caughtError,
      observe,
      unobserve
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.tracker !== this.props.tracker) {
      this.initTracker(nextProps.tracker, nextProps);
    }
  }

  observe = (element, tracking) => {
    if (this.state.observe) {
      this.state.observe(element, tracking);
    } else {
      this.observeStack.push({ element, tracking });
    }
  };

  unobserve = element => {
    if (this.state.unobserve) {
      this.state.unobserve(element);
    } else {
      this.observeStack = this.observeStack.filter(
        variation => element !== variation.element
      );
    }
  };

  pathChange = pathname => {
    if (this.state.pathChange) {
      this.state.pathChange(pathname);
    } else {
      this.pathChangeStack.push(pathname);
    }
  };

  outcome = (name, metadata) => {
    if (this.state.outcome) {
      this.state.outcome(name, metadata);
    } else {
      this.outcomeStack.push({ name, metadata });
    }
  };

  caughtError = metadata => {
    if (this.state.caughtError) {
      this.state.caughtError(metadata);
    } else {
      this.caughtErrorStack.push(metadata);
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
