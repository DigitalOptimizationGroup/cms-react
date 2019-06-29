import * as React from "react";
import { Context } from "./Context";

export const withCaughtError = WrappedComponent => {
  class ConnectTrackers extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
  return props => (
    <Context.Consumer>
      {({ caughtError }) => {
        return <ConnectTrackers {...{ caughtError }} {...props} />;
      }}
    </Context.Consumer>
  );
};
