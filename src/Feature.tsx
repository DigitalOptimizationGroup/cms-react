import React from "react";
import { useRef, useState, useEffect, ReactElement } from "react";
import { unstable_batchedUpdates, render } from "react-dom";
import { Observable } from "rxjs";
import { isArgsEqual } from "./isArgsEqual";
import { Context } from "./Context";
import { Track, Tracking } from "./Track";
import { Subscription } from "rxjs";

export class FeatureError extends Error {
  code: number;

  constructor(msg, code) {
    super(msg);
    this.name = "FeatureError";
    this.code = code;
  }
}

export type FeatureResult<Variation> = {
  variation: Variation;
  tracking: Tracking;
};

export type FeatureRenderProps<Variation> =
  | {
      isLoading: true;
      error: null;
      feature: FeatureResult<Variation> | null;
    }
  | {
      isLoading: false;
      error: FeatureError | null;
      feature: FeatureResult<Variation> | null;
    };

type Query = {
  queryName: string;
  args?: { [key: string]: string };
};

type FeatureProps<Variation> = Query & {
  children: (props: FeatureRenderProps<Variation>) => ReactElement;
};

type FeatureRecord<Variation> = { variation: Variation; tracking: Tracking };

type FeatureWithContextProps<Variation> = FeatureProps<Variation> & {
  cms: (query: Query) => Observable<FeatureRecord<Variation>>;
};

// function memoizeArgs(args) {
//   const ref = useRef(null);

//   if (!ref.current || !isArgsEqual(ref.current, args)) {
//     ref.current = args;
//   }

//   return ref.current;
// }

// function FeatureWithContext<Variation>(
//   props: FeatureWithContextProps<Variation>
// ) {
//   const { cms, queryName, args = {}, children } = props;
//   const [isLoading, setIsLoading] = useState(true);
//   const [feature, setFeature] = useState<FeatureRecord<Variation>>(null);
//   const [error, setError] = useState<FeatureError>(null);

//   useEffect(() => {
//     const sub = cms({
//       queryName,
//       args
//     }).subscribe({
//       next: feature => {
//         unstable_batchedUpdates(() => {
//           setIsLoading(false);
//           setFeature(feature);
//         });
//       },
//       error: e => {
//         unstable_batchedUpdates(() => {
//           setIsLoading(false);

//           if (e.status === 404) {
//             setError(new FeatureError("404 - Feature not found", 404));
//           } else {
//             setError(new FeatureError("500 - API Error", 500));
//           }
//         });
//       }
//     });

//     return () => sub.unsubscribe();
//   }, [cms, queryName, memoizeArgs(args)]);

//   if (typeof children !== "function") {
//     throw new Error(
//       `The child of <Feature queryName="${queryName}"${
//         args ? " args={...}" : ""
//       }> is not a Function. You need to provide a render prop such as <Feature queryName="${queryName}"${
//         args ? " args={...}" : ""
//       }>{(props)=><div/>}</Feature>. Learn more: https://www.npmjs.com/package/@digitaloptgroup/cms-react`
//     );
//   }

//   const { variation = null, tracking = null } = feature || {};
//   console.log("return statement of FeatureWithContext", {
//     isLoading,
//     variation,
//     tracking,
//     error
//   });
//   return children({ isLoading, variation, tracking, error });
// }

function memoizeArgs(args) {
  const ref = useRef(null);

  if (!ref.current || !isArgsEqual(ref.current, args)) {
    ref.current = args;
  }

  return ref.current;
}

type FeatureProviderProps<Variation> = {
  queryName: string;
  args?: { [key: string]: string };
  children: (props: FeatureRenderProps<Variation>) => ReactElement;
};

type ConnectFeatureProps<Variation> = FeatureProviderProps<Variation> & {
  cms: any;
};

export interface FeatureProvider<Variation> {
  Track: typeof Track;
  (props: FeatureProviderProps<Variation>): ReactElement;
}

type State<Variation> = FeatureRenderProps<Variation>;

class FeatureWithContext<Variation> extends React.Component<
  FeatureWithContextProps<Variation>,
  State<Variation>
> {
  private subscription: Subscription;
  state: State<Variation> = {
    isLoading: true,
    error: null,
    feature: null
  };

  componentWillMount() {
    // if server
    // do the stuff
    // embed the data into the worker so we can be sync here
    if (typeof self !== "undefined" && typeof window === "undefined") {
      this.subscription = this.subscribeToFeature(this.props);
    }
  }

  componentDidMount() {
    this.subscription = this.subscribeToFeature(this.props);
  }

  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe();
  }

  componentWillReceiveProps(nextProps: FeatureWithContextProps<Variation>) {
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
  }: FeatureWithContextProps<Variation>) => {
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
            error: new FeatureError("404 - Feature not found", 404)
          });
        } else {
          this.setState({
            isLoading: false,
            error: new FeatureError("500 - API Error", 500)
          });
        }
      }
    });
  };

  render() {
    const { isLoading, error, feature } = this.state;
    const { children } = this.props;

    // TypeScript can't infer this descriminated union correctly because
    // we're destructuring so we have to add a manual check and the error: null
    if (isLoading === true) {
      return children({
        isLoading,
        error: null,
        feature
      });
    } else {
      return children({
        isLoading,
        error,
        feature
      });
    }
  }
}

// this could probably use the useContext hook
// const {cms} = useContext(Context)
function Feature<Variation = any>(props: FeatureProps<Variation>) {
  return (
    <Context.Consumer>
      {({ cms }) => <FeatureWithContext cms={cms} {...props} />}
    </Context.Consumer>
  );
}

Feature.Track = Track;

export { Feature };
