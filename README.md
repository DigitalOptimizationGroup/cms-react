# Digital Optimization Group - Headless CMS for A/B Testing - React SDK

This library is a developer preview.

It provides an easy and powerful way to implement A/B testing with `React`. It is made to work with Digital Optimization Groups' Headless CMS and requires an account on our platform.

Signing up to developer preview requires an invite. You may get one from a current user or you may email `invites@digitaloptgroup.com`. We are people and developers over here too, so just tell us a bit about yourself and what you have in mind. We'll try to reach out to as many requests as possible.

## Features

- Simple implementation with a render prop
- A/B/n testing of arbitrary data structures
- A/B/n testing of `React` components
- Viewport exposure tracking of all variations
- Wide range of client metrics automatically collected and associated with variations

## Usage

```
npm install --save @digitaloptgroup/cms-react
```

Wrap your root component in our provider.

```js
import { ProviderWithTracking } from "@digitaloptgroup/cms-react";

const appConfig =
  (typeof window !== "undefined" && window.__APP_CONFIG__) || {};

const cmsConfig = {
  apiUrl: "api-url-for-your-project",
  projectId: appConfig.projectId,
  rid: appConfig.rid,
  vid: appConfig.vid,
  startTimestamp: appConfig.startTimestamp,
  apiKey: "your_api_key"
};

ReactDOM.render(
  <ProviderWithTracking {...cmsConfig}>
    <App />
  </ProviderWithTracking>,
  document.getElementById("root")
);
```

Anywhere in your app load A/B testing data from our API. Our API is deployed across 180+ worldwide datacenters for low-latency resolution.

```js
import React from "react";
import { Feature } from "@digitaloptgroup/cms-react";

function App() {
  return (
    <Feature queryName="helloWorld">
      {({ headline, subhead, image }) => {
        if (headline) {
          return (
            <div>
              <img src={image.url} />
              <h1>{headline}</h1>
              <h4>{subhead}</h4>
            </div>
          );
        }
        return <div>Loading...</div>;
      }}
    </Feature>
  );
}

export default App;
```

A/B testing components with lazy loading (of only the components selected for a given visitor).

```js
import React, { lazy } from "react";
import { componentExperiment } from "@digitaloptgroup/cms-react";

const MyComponent = componentExperiment(
  {
    a: lazy(() => import("./AComponent")),
    b: lazy(() => import("./BComponent"))
  },
  {
    experimentName: "example",
    // optional loading Component passed into a <Suspense/> wrapper that is
    // displayed while your component is loading
    Loading: <div>Loading...</div>
  }
);

function App() {
  return (
    <div>
      <MyComponent />
    </div>
  );
}

export default App;
```

A/B testing lists of data structures.

```js
import React, { Component } from "react";
import { Feature, NestedFeature } from "@digitaloptgroup/cms-react";

function NavItem({ feature }) {
  return (
    <NestedFeature feature={feature}>
      {({ text, path }) => {
        return (
          <div
            key={i}
            onClick={this.props.linkTo(`/${path === "/" ? "" : path}`)}
            style={{ padding: "20px", cursor: "pointer" }}
          >
            {text}
          </div>
        );
      }}
    </NestedFeature>
  );
}

function MainNav() {
  return (
    <Feature queryName="mainNav">
      {({ feature }) => {
        return (
          <div>
            {feature.map((item, i) => {
              return <NavItem feature={item} key={i} />;
            })}
          </div>
        );
      }}
    </Feature>
  );
}

export default MainNav;
```

It's simple to add localization or any other kind of segmentation by adding parameters to your schemas and then using those to make queries at runtime. For example by adding `args={{ language: navigation.language }}` to our first example, we could query by language (obviously greatly simplified for example).

```js
import React from "react";
import { Feature } from "@digitaloptgroup/cms-react";

function App() {
  return (
    <Feature queryName="helloWorld" args={{ language: navigation.language }}>
      {({ headline, subhead, image }) => {
        if (headline) {
          return (
            <div>
              <img src={image.url} />
              <h1>{headline}</h1>
              <h4>{subhead}</h4>
            </div>
          );
        }
        return <div>Loading...</div>;
      }}
    </Feature>
  );
}

export default App;
```

## Advanced configuration

Full configuration options for Component A/B testing.

```js
const MyComponent = componentExperiment(
  {
    a: lazy(() => import("./AComponent")),
    b: lazy(() => import("./BComponent"))
  },
  {
    queryName: "codeExperiment",
    args: { experimentName: "example" },
    field: "case",
    wrappers: {
      a: "span",
      b: "h1"
    },
    wrapperProps: {
      b: { style: { border: "5px solid red" } }
    },
    default: () => <div>Default</div>,
    Loading: <div>Loading...</div>
  }
);
```

Server side data resolution and caching. If you are deploying your app into our Application Delivery Network you can provide a `routes.json` configuration file that will cache API data and inject into the page while still on the server. Completely eliminating client side data fetching latency.

```json
{
  "/": [
    { "queryName": "helloWorld", "args": {} }
    { "queryName": "codeExperiment", "args": { "name": "example" } }]
}
```

## Server side rendering

If you'd like to do server side rendering just reach out to us.
