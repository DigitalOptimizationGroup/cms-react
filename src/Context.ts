import { createContext } from "react";
import { Trackers } from "@digitaloptgroup/analytics";

type SDKContext = {
  cms?: any;
  pathChange?: Trackers.pathChange;
  outcome?: Trackers.outcome;
  caughtError?: Trackers.caughtError;
  observe?: any;
  unobserve?: any;
};

export const Context = createContext<SDKContext>({});
