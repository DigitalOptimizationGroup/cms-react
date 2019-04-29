import * as React from "react";
import { TrackExposure } from "./TrackExposure";

export class NestedFeature extends React.Component {
  render() {
    if ((this.props.feature || {})._ab !== undefined) {
      return (
        <TrackExposure _ab={(this.props.feature || { _ab: {} })._ab}>
          {this.props.children({
            feature: (this.props.feature || {}).assignment,
            _ab: (this.props.feature || { _ab: {} })._ab
          })}
        </TrackExposure>
      );
    }

    return this.props.children({
      feature: (this.props.feature || {}).assignment,
      _ab: (this.props.feature || { _ab: {} })._ab
    });
  }
}
