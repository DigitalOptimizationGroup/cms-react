import * as React from "react";
import { Context } from "./Context";
import { TrackExposure } from "./TrackExposure";

class ConnectFeature extends React.Component {
  state = {};

  componentDidMount() {
    this.subscribeToFeature(this.props);
  }

  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe();
  }

  componentWillReceiveProps(nextProps) {
    // this check allows the subscribed feature to change when the args change
    // such as by the url changing but the component still being mounted
    if (
      this.props.queryName !== nextProps.queryName ||
      this.props.args !== nextProps.args ||
      this.props.cms !== nextProps.cms
    ) {
      this.subscription && this.subscription.unsubscribe();
      this.setState({ variationId: "", feature: {} });
      this.subscribeToFeature(nextProps);
    }
  }

  subscribeToFeature = ({ cms, queryName, args = {} }) => {
    this.subscription =
      cms &&
      cms({
        queryName,
        args
      }).subscribe({
        next: feature => {
          this.setState({
            feature
          });
        },
        error: e => {
          if (e.status === 404) {
            this.setState({
              error: {
                message: "404 - Feature not found",
                status: 404
              }
            });
          }
        }
      });
  };

  render() {
    if ((this.state.feature || {})._ab !== undefined) {
      // could render a not found component if passed in
      return (
        <TrackExposure _ab={(this.state.feature || { _ab: {} })._ab}>
          {this.props.children((this.state.feature || {}).assignment || {})}
        </TrackExposure>
      );
    }

    return this.props.children((this.state.feature || {}).assignment || {});
  }
}

export const Feature = props => (
  <Context.Consumer>
    {({ cms }) => {
      return <ConnectFeature cms={cms} {...props} />;
    }}
  </Context.Consumer>
);