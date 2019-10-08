export { AbTesting } from "./AbTestAndTrackProvider";
export { Feature, FeatureRenderProps } from "./Feature";
export { Tracking } from "./Track";
export { withCaughtError } from "./withCaughtError";
export { withOutcome } from "./withOutcome";
export { withPathChange } from "./withPathChange";
export {
  registerRenderer,
  isEdge,
  getEdgeInfo
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
console.log("V1.1");
