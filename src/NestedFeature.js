import * as React from "react";
import { TrackExposure } from "./TrackExposure";

export function NestedFeature({ feature, children }) {
  if ((feature || {})._ab !== undefined) {
    return (
      <TrackExposure
        _ab={feature._ab}
        // queryName={queryName}
        // args={args}
      >
        {({ forwardedRef }) => {
          return children({
            ...((feature || {}).assignment || {}),
            _ab: feature._ab,
            ...(forwardedRef ? { forwardedRef } : {})
          });
        }}
      </TrackExposure>
    );
  }

  return children((feature || {}).assignment);
}
