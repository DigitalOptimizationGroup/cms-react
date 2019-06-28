import * as React from "react";
import { TrackExposure } from "./TrackExposure";

export function NestedFeature({
  feature,
  children,
  queryName,
  args,
  tagName: TagName = "div",
  ...rest
}) {
  if (feature) {
    return (
      <TrackExposure _ab={feature._ab} queryName={queryName} args={args}>
        {({ forwardedRef }) => {
          // if TagName === null then we do not wrap in a root element and forward the ref
          if (TagName === null) {
            return children({
              feature: (feature || {}).assignment || {},
              _ab: feature._ab,
              forwardedRef
            });
          }
          return (
            <TagName
              {...rest}
              ref={forwardedRef}
              children={children({
                feature: (feature || {}).assignment || {},
                _ab: feature._ab
              })}
            />
          );
        }}
      </TrackExposure>
    );
  }
  return children({});
}
