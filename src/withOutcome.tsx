import * as React from "react";
import { Component, ComponentType } from "react";
import { Context } from "./Context";

export const withOutcome = <Props extends object>(
  WrappedComponent: ComponentType<Props>
) => {
  class ConnectTrackers extends Component<Props> {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return props => (
    <Context.Consumer>
      {({ outcome }) => {
        return <ConnectTrackers {...{ outcome }} {...props} />;
      }}
    </Context.Consumer>
  );
};
