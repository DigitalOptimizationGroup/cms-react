import * as React from "react";
import { Context } from "./Context";

export const trackPathChange = WrappedComponent => {
  class TrackPathChange extends React.Component {
    componentDidMount() {
      this.props.pathChange(this.props.path);
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.path !== nextProps.path) {
        this.props.pathChange(this.props.path);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
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
