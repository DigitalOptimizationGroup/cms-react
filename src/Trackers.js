import * as React from "react";
import { Context } from "./Context";

export const trackers = WrappedComponent => {
  class ConnectTrackers extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
  return props => (
    <Context.Consumer>
      {({ pathChange, caughtError, outcome, observe, unobserve }) => {
        return (
          <ConnectTrackers
            {...{ pathChange, caughtError, outcome, observe, unobserve }}
            {...props}
          />
        );
      }}
    </Context.Consumer>
  );
};
