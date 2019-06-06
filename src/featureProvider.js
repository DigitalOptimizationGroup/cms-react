import * as React from "react";
import { Context } from "./Context";
import { isArgsEqual } from "./isArgsEqual";

export const featureProvider = WrappedComponent => {
  class ConnectFeature extends React.Component {
    state = {};

    componentDidMount() {
      this.subscribeToFeature(this.props);
    }

    componentWillUnmount() {
      this.subscription && this.subscription.unsubscribe();
    }

    componentWillReceiveProps(nextProps) {
      const { queryName, args, cms } = this.props;
      // this check allows the subscribed feature to change when the args change
      // such as by the url changing but the component still being mounted
      if (
        queryName !== nextProps.queryName ||
        !isArgsEqual(args, nextProps.args) ||
        cms !== nextProps.cms
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
      if (typeof this.props.children !== "function") {
        throw new Error(
          `The child of <Feature queryName="${this.props.queryName}"${
            this.props.args ? " args={...}" : ""
          }> is not a Function. You need to provide a render prop such as <Feature queryName="${
            this.props.queryName
          }"${
            this.props.args ? " args={...}" : ""
          }>{(props)=><div/>}</Feature>. Learn more: https://www.npmjs.com/package/@digitaloptgroup/cms-react`
        );
      }

      return <WrappedComponent {...this.props} feature={this.state.feature} />;
    }
  }
  return props => {
    return (
      <Context.Consumer>
        {({ cms }) => {
          return <ConnectFeature cms={cms} {...props} />;
        }}
      </Context.Consumer>
    );
  };
};