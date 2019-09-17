import React from "react";
import { FC, ReactElement } from "react";
import { Context } from "./Context";

type TrackRenderProps<RefElement extends Element> = {
  trackingRef: (node: RefElement) => void;
};

type TrackRenderFunction<RefElement extends Element> = (
  props: TrackRenderProps<RefElement>
) => ReactElement;

type Props = {
  children: (any) => any;
  unobserve: (node: Element) => void;
  observe: (node: Element, options: any) => void;
  releaseId: string;
  featureId: string;
  variationId: string;
  exposureId: string;
};

class ConnectTrackExposure extends React.Component<Props> {
  trackedElement: Element;

  forwardedRef = (node: Element) => {
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

export type Tracking = {
  releaseId: string;
  variationId: string;
  featureId: string;
  exposureId: string;
  position: number;
};

type TrackProps<RefElement extends Element> = Tracking & {
  children: TrackRenderFunction<RefElement>;
};

export function Track<RefElement extends Element = any>(
  props: TrackProps<RefElement>
) {
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
}
