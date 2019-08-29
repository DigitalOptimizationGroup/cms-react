import * as React from "react";
import { Component, ComponentType } from "react";
import { Context } from "./Context";

export const withCaughtError = <Props extends object>(
  WrappedComponent: ComponentType<Props>
) => {
  class ConnectTrackers extends Component<Props> {
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
