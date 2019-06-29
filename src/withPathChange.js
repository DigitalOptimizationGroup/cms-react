import * as React from "react";
import { Context } from "./Context";

export const withPathChange = WrappedComponent => {
  class ConnectTrackers extends React.Component {
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
