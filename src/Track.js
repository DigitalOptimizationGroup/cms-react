import * as React from "react";
import { Context } from "./Context";

class ConnectTrackExposure extends React.Component {
  forwardedRef = node => {
    if (this.forwardedRef.current) {
      this.props.unobserve(this.forwardedRef.current);
    }

    this.forwardedRef.current = node;
    if (node !== null) {
      const { releaseId, featureId, variationId, exposureId } = this.props;
      this.props.observe(node, {
        releaseId,
        featureId,
        variationId,
        exposureId
      });
    }
  };

  componentDidMount() {
    // maybe these should be console.warn & don't set up the tracking
    if (!this.forwardedRef.current) {
      throw new Error(
        `<Feature.Track /> cannot find a DOM ref node. Provide ref={trackingRef} to the root DOM element.`
      );
    }
    if (
      this.props.releaseId === undefined ||
      this.props.featureId === undefined ||
      this.props.variationId === undefined ||
      this.props.exposureId === undefined
    ) {
      throw new Error(
        `<Feature.Track /> was not passed valid tracking data. It should be called: <Feature.Track {...tracking} />`
      );
    }
  }

  componentWillUnmount() {
    if (this.forwardedRef.current) {
      this.props.unobserve(this.forwardedRef.current);
    }
  }

  render() {
    return this.props.children({
      trackingRef: this.forwardedRef
    });
  }
}

export const Track = props => {
  return (
    <Context.Consumer>
      {({ observe, unobserve }) => {
        return (
          <ConnectTrackExposure
            observe={observe}
            unobserve={unobserve}
            {...props}
          />
        );
      }}
    </Context.Consumer>
  );
};
