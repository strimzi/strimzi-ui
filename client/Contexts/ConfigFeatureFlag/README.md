# ConfigFeatureFlag

This context will perform and store the result of a GraphQL query against the `/config` endpoint presented by the UI server, returning all configuration and feature flag state. This will allow the UI client to discover and refresh itself at runtime. The context will provide traditional provider and consumer components to directly retrieve/access both the feature flag and config values. In addition, the exported `FeatureFlag` component makes use of this context, providing a component wrapper around for ease of use.

A hook, `useConfigFeatureFlag` [is also available. which makes use of this context.](../../Hooks/useConfigFeatureFlag/README.md).

## Value returned

The value(s) returned by this context are categorised into three types:

- `bootstrapConfig` - critical bootstrap configuration, retrieved/parsed from the returned `index.html`
- `client` - all client configuration values, retrieved from the server at runtime
- `featureFlags` - feature flag state for the UI (including server), retrieved from the server at runtime, [merged with values set in the URL (if any)](#URL-values). URL values will take precedence.

Due to the majority of configuration coming from an asynchronous call, the returned value also will contain:

- `loading` - is the call for config data in flight?
- `error` - did the call for config data fail?
- `isComplete` - did the call for config data complete (successfully)?
- `triggerRefetch` - function to trigger a refetch of data. Expected to be used in error cases where the call failed
- `rawResponse` - the raw response for the config request. Will contain either error data, or the completed response

It will be the responsibility of any consumer of this context to handle the loading, error and success cases.

### URL values

If required, feature flag values can be specified at runtime as search parameters, to override any values defined/retrieved. The format is as follows:

(?)ff=<JsonPathOfFlag>=<true | false>,<JsonPathOfFlag>=<true | false>,...

I.e:

```
https://hostname/?ff=feature.flag.name1=true,feature.flag.name2=false
```

This would enable `feature.flag.name1` and disable `feature.flag.name2` from the client's point of view, even if the response from the server is different. The `ff` parameter is optional. When not present, the retrieved feature flag state from the server will be used.

## Usage

This context provides 4 publicly exported items for use. They are the context itself, a producer, consumer, as well as a `FeatureFlag` component to provide a simple declarative method to enable or disable specific UI sections. _Do note_ that you should never use the exported context directly - use one of the producer, consumer, or hook to fetch/access values.

### `ConfigFeatureFlagProvider`, `ConfigFeatureFlagConsumer` components

- `ConfigFeatureFlagProvider` is a component which makes the request to the `/config` endpoint, and manages the result. It should only be placed in the `index.ts` in `Bootstrap` as it is intended to be a single use component.
- `ConfigFeatureFlagConsumer` is a standard Context consumer, providing the `value` of the context at render time.

Example usage:

```
...
<ConfigFeatureFlagProvider>
    ...
    <ConfigFeatureFlagConsumer>
        {(value) => {
            // do something with the context value here
        }}
    </ConfigFeatureFlagConsumer>
    ...
</ConfigFeatureFlagProvider>
...
```

### `FeatureFlag`

The `FeatureFlag` component has been provided to allow easy/fast grouping of React components with a particular flag a declarative manner. It expects one property, defined below:

- 'flag' - the `json path` of the flag to enable or disable the child content - eg `client.Home.showVersion`. If not provided or found, it will default to `false`, so child content will not render.

Example usage:

```
...
import { FeatureFlag } from 'Contexts';
...
    <FeatureFlag flag={'client.Home.showVersion'}>
        {loading && `Loading....`}
        {isComplete && `Version: ${client.version}`}
    </FeatureFlag>
...

```

In this case, the loading or version string will only render if `client.Home.showVersion` is `true`.

Alternatively, the current feature flag state can be accessed via the `featureFlags` key provided by the context if required/more appropriate.

## I am updating configuration/feature flags - what do I need to do?

When adding, removing or changing configuration values, you will need to check (and possibly change) the following files for those configuration changes to take effect:

- The Query for the configuration: [client/Queries/Config/index.ts](../../Queries/Config/index.ts)
- The tests for this context (as they use the config query) to return representative data
