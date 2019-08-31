import React from "react";
import { useRef, useState, useEffect, ReactElement } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { Observable } from "rxjs";
import { isArgsEqual } from "./isArgsEqual";
import { Context } from "./Context";
import { Track, Tracking } from "./Track";

export class FeatureError extends Error {
  code: number;

  constructor(msg, code) {
    super(msg);
    this.name = "FeatureError";
    this.code = code;
  }
}

export type FeatureRenderProps<Variation> = {
  isLoading: boolean;
  variation: Variation;
  tracking: Tracking;
  error: FeatureError;
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

function memoizeArgs(args) {
  const ref = useRef(null);

  if (!ref.current || !isArgsEqual(ref.current, args)) {
    ref.current = args;
  }

  return ref.current;
}

function FeatureWithContext<Variation>(
  props: FeatureWithContextProps<Variation>
) {
  const { cms, queryName, args = {}, children } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [feature, setFeature] = useState<FeatureRecord<Variation>>(null);
  const [error, setError] = useState<FeatureError>(null);

  useEffect(() => {
    const sub = cms({
      queryName,
      args
    }).subscribe({
      next: feature => {
        unstable_batchedUpdates(() => {
          setIsLoading(false);
          setFeature(feature);
        });
      },
      error: e => {
        unstable_batchedUpdates(() => {
          setIsLoading(false);

          if (e.status === 404) {
            setError(new FeatureError("404 - Feature not found", 404));
          } else {
            setError(new FeatureError("500 - API Error", 500));
          }
        });
      }
    });

    return () => sub.unsubscribe();
  }, [cms, queryName, memoizeArgs(args)]);

  if (typeof children !== "function") {
    throw new Error(
      `The child of <Feature queryName="${queryName}"${
        args ? " args={...}" : ""
      }> is not a Function. You need to provide a render prop such as <Feature queryName="${queryName}"${
        args ? " args={...}" : ""
      }>{(props)=><div/>}</Feature>. Learn more: https://www.npmjs.com/package/@digitaloptgroup/cms-react`
    );
  }

  const { variation = null, tracking = null } = feature || {};
  return children({ isLoading, variation, tracking, error });
}
function Feature<Variation = any>(props: FeatureProps<Variation>) {
  return (
    <Context.Consumer>
      {({ cms }) => <FeatureWithContext cms={cms} {...props} />}
    </Context.Consumer>
  );
}

Feature.Track = Track;

export { Feature };
