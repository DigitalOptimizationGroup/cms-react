import * as React from "react";
import { Context } from "./Context";
import { isArgsEqual } from "./isArgsEqual";

export const featureProvider = WrappedComponent => {
  class ConnectFeature extends React.Component {
    state = {
      isLoading: true,
      feature: undefined,
      error: undefined
    };

    componentDidMount() {
      this.subscription = this.subscribeToFeature(this.props);
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
        !isArgsEqual(args, nextProps.args)
      ) {
        this.setState({
          feature: undefined,
          isLoading: true,
          error: undefined
        });
        // Underlying webSocket is ref counted, and this might be the only
        // subscription at this point, so we want to make sure we subscribe to
        // our new feature before unsubscribing from the old one, so the socket
        // doesn't close.
        const nextSub = this.subscribeToFeature(nextProps);
        this.subscription.unsubscribe();
        this.subscription = nextSub;
      }
    }

    subscribeToFeature = ({ cms, queryName, args = {} }) => {
      return cms({
        queryName,
        args
      }).subscribe({
        next: feature => {
          this.setState({
            isLoading: false,
            feature
          });
        },
        error: e => {
          if (e.status === 404) {
            this.setState({
              isLoading: false,
              error: {
                message: "404 - Feature not found",
                status: 404
              }
            });
          } else {
            this.setState({
              isLoading: false,
              error: {
                message: "500 - API Error",
                status: 500
              }
            });
          }
        }
      });
    };

    render() {
      const {
        children,
        queryName,
        args,
        errorCallback,
        loadingCallback
      } = this.props;

      if (typeof children !== "function") {
        throw new Error(
          `The child of <Feature queryName="${queryName}"${
            args ? " args={...}" : ""
          }> is not a Function. You need to provide a render prop such as <Feature queryName="${queryName}"${
            args ? " args={...}" : ""
          }>{(props)=><div/>}</Feature>. Learn more: https://www.npmjs.com/package/@digitaloptgroup/cms-react`
        );
      }

      // call and return error or loading callbacks if applicable
      const { error, feature, isLoading } = this.state;
      if (error && errorCallback) {
        return errorCallback({ queryName, args, error });
      } else if (isLoading && loadingCallback) {
        return loadingCallback({ queryName, args });
      }
      return (
        <WrappedComponent
          {...this.props}
          feature={feature}
          isLoading={isLoading}
          error={error}
        />
      );
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
