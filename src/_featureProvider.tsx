import React from "react";
import { ReactElement } from "react";
import { Context } from "./Context";
import { isArgsEqual } from "./isArgsEqual";
import { Track, Tracking } from "./Track";

type FeatureRenderProps = {
  isLoading: boolean;
  variation: any;
  tracking: Tracking;
  error: { message: string; code: number };
};

type FeatureProviderProps = {
  queryName: string;
  args?: { [key: string]: string };
  children: (props: FeatureRenderProps) => ReactElement;
};

type ConnectFeatureProps = FeatureProviderProps & {
  cms: any;
};

export interface FeatureProvider {
  Track: typeof Track;
  (props: FeatureProviderProps): ReactElement;
}

export const featureProvider = (WrappedComponent): FeatureProvider => {
  class ConnectFeature extends React.Component<ConnectFeatureProps> {
    private subscription: any;
    state = {
      isLoading: true,
      variation: null,
      tracking: null,
      error: null
    };

    componentWillMount() {
      // if server
      // do the stuff
      // embed the data into the worker so we can be sync here
      if (typeof self !== "undefined" && typeof window === "undefined") {
        console.log("self !== undefined");
        this.subscription = this.subscribeToFeature(this.props);
      }
    }

    componentDidMount() {
      this.subscription = this.subscribeToFeature(this.props);
    }

    componentWillUnmount() {
      this.subscription && this.subscription.unsubscribe();
    }

    componentWillReceiveProps(nextProps: ConnectFeatureProps) {
      const { queryName, args } = this.props;
      // this check allows the subscribed feature to change when the args change
      // such as by the url changing but the component still being mounted
      if (
        queryName !== nextProps.queryName ||
        !isArgsEqual(args, nextProps.args)
      ) {
        this.setState({
          isLoading: true,
          error: null
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

    subscribeToFeature = ({
      cms,
      queryName,
      args = {}
    }: ConnectFeatureProps) => {
      return cms({
        queryName,
        args
      }).subscribe({
        next: feature => {
          this.setState({
            isLoading: false,
            variation: feature.variation,
            tracking: feature.tracking
          });
        },
        error: e => {
          if (e.status === 404) {
            this.setState({
              isLoading: false,
              error: {
                message: "404 - Feature not found",
                code: 404
              }
            });
          } else {
            this.setState({
              isLoading: false,
              error: {
                message: "500 - API Error",
                code: 500
              }
            });
          }
        }
      });
    };

    render() {
      const { error, variation, tracking, isLoading } = this.state;
      const { cms, ...rest } = this.props;
      return (
        <WrappedComponent
          {...rest}
          variation={variation}
          tracking={tracking}
          isLoading={isLoading}
          error={error}
        />
      );
    }
  }
      <Context.Consumer>
        {({ cms }) => {
          return <ConnectFeature cms={cms} {...props} />;
        }}
      </Context.Consumer>
    );
  };

  component.Track = Track;

  return component;
};
