import * as React from "react";
import { useCallback } from "react";
import { Context } from "./Context";
/* 
const ConnectTrackExposure = ({
  queryName,
  args,
  observe,
  unobserve,
  _ab,
  children
}) => {
  console.warn("hello");
  const forwardedRef = useCallback(node => {
    if (false && !node) {
      throw new Error(
        `<Feature queryName="${queryName}"${
          args ? " args={...}" : ""
        }> cannot find a DOM ref node. Provide ref={forwardRef} to the root DOM element. Learn more: https://www.npmjs.com/package/@digitaloptgroup/cms-react`
      );
    }
    if (node) {
      observe(node, _ab);
    }

    return () => {
      console.error("REF CHANGED");
      unobserve(node);
    };
  });

  return children({ forwardedRef });
}; */

class ConnectTrackExposure extends React.Component {
  forwardedRef = node => {
    console.warn("this.forwardedRef.current", this.forwardedRef.current);
    if (this.forwardedRef.current) {
      this.props.unobserve(this.forwardedRef.current);
    }

    this.forwardedRef.current = node;
    if (node !== null) {
      this.props.observe(node, this.props._ab);
    }
  };

  componentDidMount() {
    if (!this.forwardedRef.current) {
      throw new Error(
        `<Feature queryName="${this.props.queryName}"${
          this.props.args ? " args={...}" : ""
        }> cannot find a DOM ref node. Provide ref={forwardRef} to the root DOM element. Learn more: https://www.npmjs.com/package/@digitaloptgroup/cms-react`
      );
    }
  }

  componentWillUnmount() {
    if (this.forwardedRef.current) {
      this.props.unobserve(this.forwardedRef.current);
    }
  }

  render() {
    // here this is pass the forwardedRef to the child and we don't know if it's
    // an element yet, so we risk that it can be set up twice, which is not good
    const result = this.props.children({
      forwardedRef: this.forwardedRef
    });

    if (typeof result.type === "string") {
      return React.cloneElement(result, {
        ref: this.forwardedRef
      });
    } else {
      return result;
    }
  }
}

export const TrackExposure = props => {
  return (
    <Context.Consumer>
      {({ observe, unobserve }) => {
        return (
          <ConnectTrackExposure
            observe={observe}
            unobserve={unobserve}
            {...props}
          />
        );
      }}
    </Context.Consumer>
  );
};
