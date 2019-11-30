declare const __DOG_WORKER__: any;

import React, { Component } from "react";

export function edgeLoadable(options) {
  const loader = {
    scriptPaths: null,
    linkPaths: null,
    loader: options.loader,
    Component: null
  };

  if (typeof __DOG_WORKER__ !== "undefined") {
    __DOG_WORKER__.loaders.push(loader);
  }

  return class EdgeLoadable extends Component {
    state = {
      Component: null
    };

    componentWillMount() {
      if (loader.Component) {
        if (typeof __DOG_WORKER__ !== "undefined") {
          __DOG_WORKER__.usedScriptPaths.push(...loader.scriptPaths);
          __DOG_WORKER__.usedLinkPaths.push(...loader.linkPaths);
        }

        this.setState({
          Component: loader.Component
        });
      }
    }

    async componentDidMount() {
      if (!this.state.Component) {
        const moduleOrComponent = await options.loader();
        const Component = moduleOrComponent.__esModule
          ? moduleOrComponent.default
          : moduleOrComponent;
        this.setState({ Component });
      }
    }

    render() {
      const { Component } = this.state;

      if (Component) {
        return <Component />;
      } else if (typeof options.loading === "function") {
        return options.loading();
      } else {
        return null;
      }
    }
  };
}
