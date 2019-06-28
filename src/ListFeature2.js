import * as React from "react";
// import { Context } from "./Context";
import { TrackExposure } from "./TrackExposure";
// import { isArgsEqual } from "./isArgsEqual";
import { featureProvider } from "./featureProvider";

function ConnectListFeature(props) {
  const {
    feature,
    queryName,
    args,
    isLoading,
    error,
    children,
    tagName: TagName = "div",
    childTagName: ChildTagName = "div",
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
            return feature.assignment.map((feature, i) => {
              const { assignment, _ab } = feature;
              if (_ab !== undefined && assignment !== undefined) {
                return (
                  <TrackExposure
                    _ab={_ab}
                    key={_ab.variationId}
                    queryName={queryName}
                    args={args}
                  >
                    {({ forwardedRef }) => {
                      // if TagName === null then we do not wrap in a root element and forward the ref
                      if (ChildTagName === null) {
                        return children({
                          feature: (feature || {}).assignment || {},
                          _ab: feature._ab,
                          forwardedRef,
                          isLoading,
                          error
                        });
                      }
                      return (
                        <ChildTagName
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
              } else {
                return null;
              }
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
            >
              {feature.assignment.map((feature, i) => {
                const { assignment, _ab } = feature;
                if (_ab !== undefined && assignment !== undefined) {
                  return (
                    <TrackExposure
                      _ab={_ab}
                      key={_ab.variationId}
                      queryName={queryName}
                      args={args}
                    >
                      {({ forwardedRef }) => {
                        // if TagName === null then we do not wrap in a root element and forward the ref
                        if (ChildTagName === null) {
                          console.log("NO CHILD TAG NAME");

                          return children({
                            feature: (feature || {}).assignment || {},
                            _ab: feature._ab,
                            forwardedRef,
                            isLoading,
                            error
                          });
                        }
                        return (
                          <ChildTagName
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
                } else {
                  return null;
                }
              })}
            </TagName>
          );
        }}
      </TrackExposure>
    );
  }

  if ((feature || {})._ab !== undefined) {
    return feature.assignment.map((feature, i) => {
      const { assignment, _ab } = feature;
      if (_ab !== undefined && assignment !== undefined) {
        return (
          <TrackExposure
            _ab={_ab}
            key={_ab.variationId}
            queryName={queryName}
            args={args}
          >
            {({ forwardedRef }) => {
              return children(
                {
                  ...(Array.isArray(assignment)
                    ? { list: assignment, isNestedList: true }
                    : assignment),
                  _ab,
                  ...(forwardedRef ? { forwardedRef } : {})
                },
                i,
                feature.assignment // the whole list
              );
            }}
          </TrackExposure>
        );
      } else {
        return null;
      }
    });
  }

  // probably we don't want to return null but rather pass in some loading state
  return null;
}

export const ListFeature2 = featureProvider(ConnectListFeature);

// class ConnectListFeature extends React.Component {
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
//       this.props.queryName !== nextProps.queryName ||
//       !isArgsEqual(args, nextProps.args) ||
//       this.props.cms !== nextProps.cms
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
//     if ((this.state.feature || {})._ab !== undefined) {
//       return this.state.feature.assignment.map(({ assignment, _ab }, i) => {
//         return (
//           <TrackExposure
//             _ab={_ab}
//             key={_ab.variationId}
//             queryName={this.props.queryName}
//             args={this.props.args}
//           >
//             {({ forwardedRef }) => {
//               return this.props.children(
//                 {
//                   ...assignment,
//                   _ab,
//                   ...(forwardedRef ? { forwardedRef } : {})
//                 },
//                 i,
//                 this.state.feature.assignment
//               );
//             }}
//           </TrackExposure>
//         );
//       });
//     }

//     // probably we don't want to return null but rather pass in some loading state
//     return null;
//   }
// }

// const ConnectedListFeature = props => {
//   return (
//     <Context.Consumer>
//       {({ cms }) => {
//         return <ConnectListFeature cms={cms} {...props} />;
//       }}
//     </Context.Consumer>
//   );
// };
