# ConfigFeatureFlag

This context will perform and store the result of a GraphQL query against the `/config` endpoint presented by the UI server, returning all configuration and feature flag state. This will allow the UI client discover and refresh itself at runtime. The context will provide hooks and consumers to direct access both the feature flag and config values.

The exported `FeatureFlag` component makes use of this context, providing a component wrapper around for ease of use.

## Usage

This context provides 4 publicly exported items for use. They are the context producer, consumer and hook, as well as a `FeatureFlag` component to provide a simple declarative method to enable or disable specific UI sections.

### `ConfigFeatureFlagProvider`, `ConfigFeatureFlagConsumer` and `useConfigFeatureFlag`

- `ConfigFeatureFlagProvider` is a component which makes the request to the `/config` endpoint, and manages the result. It should only be placed in the `index.ts` in `Bootstrap` as it is intended to be a single use component.
- `ConfigFeatureFlagConsumer` is a standard Context consumer, providing the `value` of the context at render time.
- `useConfigFeatureFlag` is a hook, which provides the `value` of the context at render time.

### `FeatureFlag`

- 'flag' - the `json path` of the flag to enable or disable the child content - eg `client.Home.showVersion`. If not provided or found, it will default to `false`, so child content will not render

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
