import * as React from "react";
import { TrackExposure } from "./TrackExposure";
import { featureProvider } from "./featureProvider";

function ConnectFeature(props) {
  const {
    feature,
    queryName,
    args,
    isLoading,
    error,
    children,
    tagName: TagName = "div",
    ...rest
  } = props;
  if (isLoading) {
    return children({ isLoading });
  } else if (error) {
    return children({ isLoading, error });
  } else {
    return (
      <TrackExposure _ab={feature._ab} queryName={queryName} args={args}>
        {({ forwardedRef }) => {
          // if TagName === null then we do not wrap in a root element and forward the ref
          if (TagName === null) {
            return children({
              feature: (feature || {}).assignment || {},
              _ab: feature._ab,
              forwardedRef,
              isLoading,
              error
            });
          }
          return (
            <TagName
              {...rest}
              ref={forwardedRef}
              children={children({
                feature: (feature || {}).assignment || {},
                _ab: feature._ab,
                isLoading,
                error
              })}
            />
          );
        }}
      </TrackExposure>
    );
  }
}

export const Feature = featureProvider(ConnectFeature);

// class ConnectFeature extends React.Component {
//   state = {};

//   componentDidMount() {
//     this.subscribeToFeature(this.props);
//   }

//   componentWillUnmount() {
//     this.subscription && this.subscription.unsubscribe();
//   }

//   componentWillReceiveProps(nextProps) {
//     const { queryName, args, cms } = this.props;
//     // this check allows the subscribed feature to change when the args change
//     // such as by the url changing but the component still being mounted
//     if (
//       queryName !== nextProps.queryName ||
//       !isArgsEqual(args, nextProps.args) ||
//       cms !== nextProps.cms
//     ) {
//       this.subscription && this.subscription.unsubscribe();
//       this.setState({ variationId: "", feature: {} });
//       this.subscribeToFeature(nextProps);
//     }
//   }

//   subscribeToFeature = ({ cms, queryName, args = {} }) => {
//     this.subscription =
//       cms &&
//       cms({
//         queryName,
//         args
//       }).subscribe({
//         next: feature => {
//           this.setState({
//             feature
//           });
//         },
//         error: e => {
//           if (e.status === 404) {
//             this.setState({
//               error: {
//                 message: "404 - Feature not found",
//                 status: 404
//               }
//             });
//           }
//         }
//       });
//   };

//   render() {
//     if (typeof this.props.children !== "function") {
//       throw new Error(
//         `The child of <Feature queryName="${this.props.queryName}"${
//           this.props.args ? " args={...}" : ""
//         }> is not a Function. You need to provide a render prop such as <Feature queryName="${
//           this.props.queryName
//         }"${
//           this.props.args ? " args={...}" : ""
//         }>{(props)=><div/>}</Feature>. Learn more: https://www.npmjs.com/package/@digitaloptgroup/cms-react`
//       );
//     }

//     if ((this.state.feature || {})._ab !== undefined) {
//       // could render a not found component if passed in
//       return (
//         <TrackExposure
//           _ab={this.state.feature._ab}
//           queryName={this.props.queryName}
//           args={this.props.args}
//         >
//           {({ forwardedRef }) => {
//             return this.props.children({
//               ...((this.state.feature || {}).assignment || {}),
//               _ab: this.state.feature._ab,
//               ...(forwardedRef ? { forwardedRef } : {})
//             });
//           }}
//         </TrackExposure>
//       );
//     }

//     return this.props.children((this.state.feature || {}).assignment || {});
//   }
// }
