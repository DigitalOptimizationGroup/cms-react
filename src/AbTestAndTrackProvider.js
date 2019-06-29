import * as React from "react";
import { connect } from "@digitaloptgroup/cms";
import { Context } from "./Context";
import { initTracker } from "@digitaloptgroup/analytics";

export class AbTesting extends React.Component {
  constructor(props) {
    super(props);
    this.cms = connect({
      apikey: this.props.apikey,
      apiUrl: this.props.apiUrl,
      vid: this.props.vid,
      realtimeUrl: this.props.realtimeUrl
    });

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

    this.pathChange = pathChange;
    this.caughtError = caughtError;
    this.outcome = outcome;
    this.observe = observe;
    this.unobserve = unobserve;
  }

  render() {
    return (
      <Context.Provider
        value={{
          cms: this.cms,
          pathChange: this.pathChange,
          outcome: this.outcome,
          caughtError: this.caughtError,
          observe: this.observe,
          unobserve: this.unobserve
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}
