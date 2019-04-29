import * as React from "react";
import { Context } from "./Context";

class ConnectTrackExposure extends React.Component {
  componentDidMount() {
    this.props.observe(this.ref, this.props._ab);
  }

  componentWillUnmount() {
    this.props.unobserve(this.ref);
  }

  render() {
    return React.cloneElement(this.props.children, {
      ref: el => (this.ref = el)
    });
  }
}

export const TrackExposure = props => {
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
