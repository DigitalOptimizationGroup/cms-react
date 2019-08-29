import * as React from "react";
import { Context } from "./Context";

type Props = {
  children: (any) => any;
  unobserve: any;
  observe: any;
  releaseId: any;
  featureId: any;
  variationId: any;
  exposureId: any;
};

class ConnectTrackExposure extends React.Component<Props> {
  trackedElement: Element;

  forwardedRef = node => {
    if (this.trackedElement) {
      this.props.unobserve(this.trackedElement);
    }

    this.trackedElement = node;
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
    if (!this.trackedElement) {
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
    if (this.trackedElement) {
      this.props.unobserve(this.trackedElement);
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
