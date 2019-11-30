export { AbTesting } from "./AbTestAndTrackProvider";
export { Feature, FeatureRenderProps } from "./Feature";
export { Tracking } from "./Track";
export { withCaughtError } from "./withCaughtError";
export { withOutcome } from "./withOutcome";
export { withPathChange } from "./withPathChange";
export {
  registerRoot,
  registerRenderer,
  isEdge,
  getEdgeInfo,
  __EXPERIMENTAL__registerCacheLoader,
  __EXPERIMENTAL__getFromCache
} from "@digitaloptgroup/cms/dist/es";
export { edgeLoadable } from "./edgeLoadable";

export type Image = {
  bytes: number;
  height: number;
  name: string;
  path: string;
  thumbnail: string;
  type: "image";
  url: string;
  width: number;
};
console.log("UPDATED - 1.1.3");
