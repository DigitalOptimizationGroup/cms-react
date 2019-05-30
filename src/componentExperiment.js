import * as React from "react";
import { Context } from "./Context";
import { TrackExposure } from "./TrackExposure";
import { isArgsEqual } from "./isArgsEqual";

class ConnectComponentExperiment extends React.Component {
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
      this.props.config.queryName !== nextProps.config.queryName ||
      !isArgsEqual(this.props.config.args, nextProps.config.args) ||
      this.props.cms !== nextProps.cms
    ) {
      this.subscription && this.subscription.unsubscribe();
      this.setState({ variationId: "", feature: {} });
      this.subscribeToFeature(nextProps);
    }
  }

  subscribeToFeature = ({ cms, config }) => {
    const queryName = config.queryName || "componentExperiment";
    const args = config.args || { experimentName: config.experimentName };
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
    const { config, components } = this.props;
    const fieldName = config.field || "component";
    if (
      (this.state.feature || {})._ab !== undefined &&
      components[this.state.feature.assignment[fieldName]] !== undefined
    ) {
      const variation = this.state.feature.assignment[fieldName];
      const ComponentVariation = components[variation];
      const Wrapper = (config.wrappers && config.wrappers[variation]) || "div";
      const Loading = config.Loading || null;

      return (
        <React.Suspense fallback={Loading}>
          <TrackExposure _ab={(this.state.feature || { _ab: {} })._ab}>
            <Wrapper
              {...(config.wrapperProps && config.wrapperProps[variation]) || {}}
            >
              <ComponentVariation />
            </Wrapper>
          </TrackExposure>
        </React.Suspense>
      );
    }
    return config.default ? <config.default /> : null;
  }
}

export const componentExperiment = (components, config) => () => (
  <Context.Consumer>
    {({ cms }) => {
      return (
        <ConnectComponentExperiment
          cms={cms}
          components={components}
          config={config}
        />
      );
    }}
  </Context.Consumer>
);

/*
This could be done by wrapping with a <Feature/> but we wanted to have 
more control over when <Tracking/> was implemented, i.e. when a lazy component is
actually rendered, which could be some time after the <Feature/> has it's data
*/
