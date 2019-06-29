import * as React from "react";
import { Context } from "./Context";

export const withOutcome = WrappedComponent => {
  class ConnectTrackers extends React.Component {
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
