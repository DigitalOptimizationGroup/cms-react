import * as React from "react";
import { Context } from "./Context";

export const trackPathChange = WrappedComponent => {
  class TrackPathChange extends React.Component {
    render() {
      const { pathChange, ...props } = this.props;
      return <WrappedComponent trackPathChange={pathChange} {...props} />;
    }
  }
  return props => (
    <Context.Consumer>
      {({ pathChange }) => {
        return <TrackPathChange pathChange={pathChange} {...props} />;
      }}
    </Context.Consumer>
  );
};
