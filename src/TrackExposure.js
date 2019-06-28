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
    if (this.forwardedRef.current) {
      this.props.unobserve(this.forwardedRef.current);
    }

    this.forwardedRef.current = node;
    if (node !== null) {
      this.props.observe(node, this.props._ab);
    }
  };

  /*
  default div
  tagName="span"
  tagName={null} -> ONLY case to pass ref

  const {queryName, args, tagName: TagName, ...rest} = props;

  if (TagName) {
    return <TagName {...rest} ref={forwardedRef}> {this.children()}</TagName>
  } else {
    return this.children();
  }






  const containerRef = useCallback(node => {
    if (node){ 
      $(node);
    }
  })

  <Feature ref={containerRef} queryNAme="ASdf" >
{   (stuff) => {

}}
  </Feature>
  */

  componentDidMount() {
    // <Feature tagName={null} />;
    // if (this.forwardedRef.current) {
    //   throw "dont use both";
    // } else if (somehowgetProps.tagName) {
    //   // use tagName
    // } else {
    //   throw "use one of them";
    // }
    /* if (!this.forwardedRef.current) {
      throw new Error(
        // this could also be ListFeature or NestedFeature
        `<Feature queryName="${this.props.queryName}"${
          this.props.args ? " args={...}" : ""
        }> cannot find a DOM ref node. Provide ref={forwardRef} to the root DOM element. Learn more: https://www.npmjs.com/package/@digitaloptgroup/cms-react`
      );
    } */
  }

  componentWillUnmount() {
    if (this.forwardedRef.current) {
      this.props.unobserve(this.forwardedRef.current);
    }
  }

  render() {
    const result = this.props.children({
      ref: this.forwardedRef
    });

    // this object thing won't work reliably
    if (typeof result.type === "string" || typeof result.type === "object") {
      // if the render prop returns an Element we can attach the ref
      return React.cloneElement(result, {
        ref: this.forwardedRef
      });
    } else {
      // otherwise we forward the ref and the user is responsible for attaching to a root Element
      return React.cloneElement(result, {
        forwardedRef: this.forwardedRef
      });
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
