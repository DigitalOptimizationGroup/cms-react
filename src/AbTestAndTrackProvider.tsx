import * as React from "react";

// fix this
import { connect } from "@digitaloptgroup/cms/dist/es";
import { Context } from "./Context";
import {
  initTracker,
  Trackers,
  ExposureTracking
} from "@digitaloptgroup/analytics";

console.log("TS VERSION!");

interface AppConfig {
  rid?: string;
  vid?: string;
  projectId?: string;
  apiKey?: string;
  startTimestamp?: number;
}

declare global {
  interface Window {
    __APP_CONFIG__: AppConfig;
  }
}

const appConfig: AppConfig =
  (typeof window !== "undefined" && window.__APP_CONFIG__) || {};

type Resolver = (options: {
  userId: string;
  queryName: string;
  args: {
    [key: string]: string;
  };
}) => void;

type Props = AppConfig & {
  apiUrl: string;
  realtimeUrl: string;
  ssrCache: {
    [key: string]: any;
  };
  resolver: Resolver;
  wsFqdn: string;
};

export class AbTesting extends React.Component<Props> {
  private cms: any;
  private trackers?: Trackers;
  private observer?: ExposureTracking;

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
      apiKey: appConfig.apiKey,
      projectId,
      rid: appConfig.rid,
      vid: appConfig.vid,
      startTimestamp: appConfig.startTimestamp
    };

    this.cms = connect({
      apikey: this.props.apiKey || cmsConfig.apiKey,
      apiUrl: this.props.apiUrl || cmsConfig.apiUrl,
      vid: this.props.vid || cmsConfig.vid,
      realtimeUrl: this.props.realtimeUrl,
      ssrCache: this.props.ssrCache,
      resolver: this.props.resolver
    });

    // only run this code in the browser
    if (typeof window !== "undefined") {
      const { initTracker } = require("@digitaloptgroup/analytics");
      console.log("init tracker", initTracker);
      this.trackers = initTracker(
        {
          rid: this.props.rid || cmsConfig.rid,
          vid: this.props.vid || cmsConfig.vid,
          projectId: this.props.projectId || cmsConfig.projectId,
          startTimestamp: this.props.startTimestamp || cmsConfig.startTimestamp,
          apiKey: this.props.apiKey || cmsConfig.apiKey
        },
        this.props.wsFqdn
      );

      this.observer = this.trackers.initIntersectionObserver();
    }
  }

  render() {
    if (typeof window !== "undefined") {
      const { trackers, observer } = this;
      return (
        <Context.Provider
          value={{
            cms: this.cms,
            pathChange: trackers.pathChange,
            outcome: trackers.outcome,
            caughtError: trackers.caughtError,
            observe: observer.observe,
            unobserve: observer.unobserve
          }}
        >
          {this.props.children}
        </Context.Provider>
      );
    } else {
      return (
        <Context.Provider
          value={{
            cms: this.cms
          }}
        >
          {this.props.children}
        </Context.Provider>
      );
    }
  }
}
