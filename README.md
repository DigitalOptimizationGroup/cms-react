# Digital Optimization Group - Headless CMS for A/B Testing - React SDK

This library is a _developer preview_.

It provides an easy and powerful way to implement A/B testing with `React`. It is made to work with Digital Optimization Groups' Headless CMS and requires an account on our platform.

Signing up for a developer preview requires an invite. If you would like to join the waiting list for access please email us at preview@digitaloptgroup.com.

The SDK includes the following features:

- Simple implementation with a render prop
- A/B/n testing of arbitrary data structures
- A/B/n testing of `React` components
- Viewport exposure tracking of all variations
- Wide range of client metrics automatically collected and associated with variations

# <a name="installation" class="anchor"></a>Installation

The DigitalOpt Group React SDK can be installed and added to the project specific dependencies by running the following command:

```
npm install --save @digitaloptgroup/cms-react
```

The SDK provides the following set of `Providers` and `Render Props`:

- AbTesting
- Feature
- Feature.Track
- withOutcome
- withPathChange
- withCaughtError

## Documentation

https://docs.digitaloptgroup.com

# <a name="ProviderWithTracking" class="anchor"></a>AbTesting Provider

Digital Optimization Groups' React SDK makes uses of a provider to inject all the required code into your application.

The _provider_ is required for the correct usage of the SDK. Its main purposes are:

- Make a connection to the public API
- Provide RealTime development feature
- Initialize analytics tracking

The provider should be placed at the `root` of your application and expect a set of configuration properties (explained below):

## Props

The React SDK requires a set of keys and configurations required to connect the Client Application with the Public API.

<b>projectId (required)</b><br/>
The Application Id or Project Id given to you by Digital Optimization Group when creating your account.

<b>vid (optional)</b><br/>
Internally the API sets a cookie with a unique ID for each user. This cookie is used to assure consistent assignment of variations. You may optionally pass in your own unique visitor identifier that will be used to provide assignments.

<b>rid (optional)</b><br/>
Unique request Id. If you are deploying your application into the DigitalOptADN you should not set this as it will be done for you automatically.

<b>startTimestamp (optional)</b><br/>
Server timestamp of request Id creation time. If you are deploying your application into the DigitalOptADN you should not set this as it will be done for you automatically.

## Usage

```js
import { AbTesting } from "@digitaloptgroup/cms-react";

ReactDOM.render(
  <AbTesting projectId="your-app-or-project-id">
    <App />
  </AbTesting>,
  document.getElementById("root")
);
```

# <a name="components" class="anchor"></a>Components

All components provided by SDK, are written as [Render Props](https://reactjs.org/docs/render-props.html) or Higher Order Components, to provide a full set of features, with minimal impact on your app.

There are currently 2 render props, and they are:

- Feature
- Feature.Track

And 3 higher order components:

- withCaughtError
- withOutcome
- withPathChange

# <a name="Feature" class="anchor"></a>Feature

This component fetches the data related to a Schema from the CMS ([Feature Schema Documentation](/cms/schema#types)).

## Props

Props that can be passed to the `Feature` component.
<b>queryName (required)</b><br/>
The root entrypoint to query your API. This is defined in the CMS when creating a new Schema.

<b>args (as required by Schema type)</b><br/>
When defining a Schema it may be created with one or more parameters, such as `path` for blog posts, `lang` for localization, or `sku` for products. Providing these to the `Feature` component will allow you to query for a specific Feature that implements a given Schema.

## Provided Props

Props passed from `Feature` to the user's render prop function.

<b>error</b><br/>
Provided in the event of an error.

```ts
type Error = null | { code: number; message: string };
```

> <b>Note on serving 404 pages</b><br/>
> If the given combination of `queryName` and `args` does not result in a feature this will return a 404 error with the following object:

```js
{code: 404, message: "404 - Feature not found"}
```

This is useful if you are serving pages, such as blog posts, and would like to dynamically show your visitors 404 pages when a page does not exist.

<b>isLoading</b><br/>
A boolean prop indicating feature loading.

```ts
type IsLoading = boolean;
```

<b>variation</b><br/>
The variation assigned to a given user for the requested feature. This can be either an object containing the properties defined by the feature's schema or it can be a list of variations.

```ts
type Variation =
  | FeatureSchema
  | Array<{ tracking: Tracking; variation: FeatureSchema }>;
type FeatureSchema = { [key]: any };
```

<b>tracking</b><br/>
The tracking object associated with a given variation.

```ts
type Tracking = {
  releaseId: string;
  featureId: string;
  variationId: string;
  exposureId: string;
};
```

## Usage

```js
import { Feature } from "@digitaloptgroup/cms-react";

function App() {
  return (
    <Feature queryName="helloWorld">
      {({ error, isLoading, variation, tracking }) => {
        if (variation) {
          const { image, headline, subhead } = variation;
          return (
            <div>
              <img src={image.url} />
              <h1>{headline}</h1>
              <h4>{subhead}</h4>
            </div>
          );
        } else if (isLoading) {
          return <div>Loading...</div>;
        } else if (error) {
          return (
            <div>
              {error.code} : {error.message}
            </div>
          );
        }
      }}
    </Feature>
  );
}
```

# <a name="feature-track" class="anchor"></a>Feature.Track

This component provides viewport tracking for assigned variations including proportion of exposure and time in viewport.

## Props

Props that MUST be passed to the `Feature.Track` component.

<b>releaseId (required)</b><br/>
This Id represents a hash of the entire release and provides integrity when analyzing data by assuring it is always possible to know what other elements may have been under test at any given time.

<b>featureId (required)</b><br/>
Represents a hash of all the variations for a given feature in a given release. It provides integrity to know what other variations where under test for a given feature.

<b>variationId (required)</b><br/>
A hash of the variation, assuring integrity of knowing the exact content for a given variation.

<b>exposureId (required)</b><br/>
Not currently used, but still required. This may be used in the future for more granular exposure tracking than provided at the variation level (like by fields).

## Provided Props

Props passed from `Feature.Track` to the user's render prop function.

<b>trackingRef</b><br/>
A React ref that MUST be attached to a root DOM element surrounding the implementation of a given variation.

## Usage

```js
import { Feature } from "@digitaloptgroup/cms-react";

function App() {
  return (
    <Feature queryName="helloWorld">
      {({ error, isLoading, variation, tracking }) => {
        if (variation) {
          return (
            <Feature.Track {...tracking}>
              {({ trackingRef }) => {
                return <div ref={trackingRef}>{/*...*/}</div>;
              }}
            </Feature.Track>
          );
        }
        /* ... */
      }}
    </Feature>
  );
}
```

# <a name="tracking" class="anchor"></a>Higher Order Components for Metrics

Refer to [A/B Testing Analytics](/analytics/a-b-testing) for a full overview of metrics automatically and manually tracked by this SDK.

This section will cover the manual tracking details from the SDK.

The SDK provides a set of higher order component that offers the possiblity of wrapping your components to track additional analytics information not tracked automatically.

The use of these HOCs requires the main application to wrapped within the _AbTesting_ provider, but it can be applied to any of the components provided within the SDK. It will also work with normal React components.

> <b>Examples</b><br/>
> Record add to cart events, page views, searches, checkouts, and more.

# <a name="withPathChange" class="anchor"></a>withPathChange

This higher order component passes the `pathChange` prop to it's wrapped child, allowing for page view metrics to be associated with A/B test variations.

## Props

None

## Provided Props

Props passed to the wrapped component.

<b>pathChange</b><br/>
A function that can be used to track pageviews.

```ts
type PathChange = (pathname: string) => void;
```

## Usage

```js
import { withPathChange } from "@digitaloptgroup/cms-react";

class BlogPost extends React.Component {
  componentDidMount() {
    this.props.pathChange(this.props.location.pathname);
  }
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.props.pathChange(this.props.location.pathname);
    }
  }
  render() {
    /*...*/
  }
}
const BlogPostWithPageTracking = withPathChange(BlogPost);
```

# <a name="withOutcome" class="anchor"></a>withOutcome

This higher order component passes the `outcome` prop to it's wrapped child, allowing for custom outcomes to be associated with A/B test variations.

## Props

None

## Provided Props

Props passed to the wrapped component.

<b>outcome</b><br/>
A function that can be used to track custom outcomes. Any outcome can be used to evaluate a given A/B test.

```ts
type Metadata = Array<{ key: string; value: string }>;
type Outcome = (name: string, metadata: Metadata) => void;
```

> <b>Naming Outcomes</b><br/>
> We recommend picking and sticking with a consistent naming convention for outcomes. One that we like is the Object / Action naming convention. For example:

- cartAddItem
- cartRemoveItem
- searchAddFilter
- searchEnterPhrase
- productView

## Usage

```js
import { withOutcome } from "@digitaloptgroup/cms-react";

class ProductItem extends React.Component {
  cartAddItem = (sku, price) => {
    const name = "cartAddItem";
    const metadata = [
      { key: "sku", value: sku },
      { key: "price", value: price }
    ];
    this.props.outcome(name, metadata);
  };
  render() {
    /*...*/
  }
}
const ProductItemWithOutcome = withOutcome(ProductItem);
```

# <a name="withCaughtError" class="anchor"></a>withCaughtError

This higher order component passes the `caughtError` prop to it's wrapped child, allowing for caught errors to be associated with A/B test variations. This can be useful for monitoring A/B tests and becoming notified of potential bugs or problems with a particular test variation.

## Props

None

## Provided Props

Props passed to the wrapped component.

<b>caughtError</b><br/>
A function that can be used to track errors your application catches.

```ts
type CaughtErrorMetadata = Array<{ key: string; value: string }>;
type CaughtError = (metadata: CaughtErrorMetadata) => void;
```

## Usage

```js
import { withCaughtError } from "@digitaloptgroup/cms-react";

class CartCheckout extends React.Component {
  completeOrder = () => {
    stripe.createSource(this.card).then(result => {
      if (result.error) {
        const metadata = [
          { key: "location", value: "stripe.createSource" },
          { key: "error", value: error.message }
        ];
        this.props.caughtError(metadata);
        /* ... */
      } else {
        /*...*/
      }
    });
  };
  render() {
    /*...*/
  }
}
const CartCheckoutWithErrorReporting = withCaughtError(CartCheckout);
```

## Server side rendering

If you'd like to do server side rendering just reach out to us.
