import * as React from "react";
import { TrackExposure } from "./TrackExposure";

export function NestedListFeature({ feature, children }) {
  if ((feature || {})._ab !== undefined) {
    return feature.assignment.map(({ assignment, _ab }, i) => {
      if (_ab !== undefined && assignment !== undefined) {
        return (
          <TrackExposure _ab={_ab} key={_ab.variationId}>
            {({ forwardedRef }) => {
              return children(
                {
                  ...(Array.isArray(assignment)
                    ? { list: assignment, isNestedList: true }
                    : assignment),
                  _ab,
                  ...(forwardedRef ? { forwardedRef } : {})
                },
                i,
                feature.assignment // the whole list
              );
            }}
          </TrackExposure>
        );
      } else {
        return null;
      }
    });

    // return (

    //   <TrackExposure
    //     _ab={feature._ab}
    //     // queryName={queryName}
    //     // args={args}
    //   >
    //     {({ forwardedRef }) => {
    //       return children({
    //         ...((feature || {}).assignment || {}),
    //         _ab: feature._ab,
    //         ...(forwardedRef ? { forwardedRef } : {})
    //       });
    //     }}
    //   </TrackExposure>
    // );
  }

  return children((feature || {}).assignment);
}
