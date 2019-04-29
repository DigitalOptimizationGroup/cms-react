import * as React from "react";
import { Context } from "./Context";

class ConnectTrackers extends React.Component {
  render() {
    return props.children({
      pathChange: this.props.pathChange,
      caughtError: this.props.caughtError,
      outcome: this.props.outcome,
      observe: this.props.observe,
      unobserve: this.props.unobserve
    });
  }
}

export const Trackers = props => (
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
