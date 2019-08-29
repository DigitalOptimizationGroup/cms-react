import * as React from "react";
import { Component, ComponentType } from "react";
import { Context } from "./Context";

export const withPathChange = <Props extends object>(
  WrappedComponent: ComponentType<Props>
) => {
  class ConnectTrackers extends Component<Props> {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
  return props => (
    <Context.Consumer>
      {({ pathChange }) => {
        return <ConnectTrackers {...{ pathChange }} {...props} />;
      }}
    </Context.Consumer>
  );
};
