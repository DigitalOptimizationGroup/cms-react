import * as React from "react";
import { connect } from "@digitaloptgroup/cms";
import { Context } from "./Context";
import { initTracker } from "@digitaloptgroup/analytics";

const appConfig =
  (typeof window !== "undefined" && window.__APP_CONFIG__) || {};

export class AbTesting extends React.Component {
  constructor(props) {
    super(props);

    const projectId = this.props.projectId || appConfig.projectId;

    if (projectId === undefined) {
      throw Error(
        "projectId must be passed as a prop to the @digitaloptgroup/cms-react provider: <AbTesting projectId={undefined} />"
      );
    }

    const cmsConfig = {
      apiUrl: `https://api-${projectId}.edgeyates.com`,
      projectId,
      rid: appConfig.rid,
      vid: appConfig.vid,
      startTimestamp: appConfig.startTimestamp
    };

    this.cms = connect({
      apikey: this.props.apiKey || cmsConfig.apiKey,
      apiUrl: this.props.apiUrl || cmsConfig.apiUrl,
      vid: this.props.vid || cmsConfig.vid,
      realtimeUrl: this.props.realtimeUrl
    });

    const {
      pathChange,
      outcome,
      caughtError,
      initIntersectionObserver
    } = initTracker(
      {
        rid: this.props.rid || cmsConfig.rid,
        vid: this.props.vid || cmsConfig.vid,
        projectId: this.props.projectId || cmsConfig.projectId,
        startTimestamp: this.props.startTimestamp || cmsConfig.startTimestamp,
        apiKey: this.props.apiKey || cmsConfig.apiKey
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
