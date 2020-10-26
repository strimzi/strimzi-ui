# ConfigFeatureFlag

This context will perform and store the result of a GraphQL query against the `/config` endpoint presented by the UI server. This will allow the UI client discover and refresh itself at runtime. The context will provide hooks and consumers to access both the feature flag and config values. In the case of feature flags, it also will export a React component (making use of this context) which will act as a high order wrapper, taking as a property the name of the flag which will toggle the rendering (or not) the wrapped child.

_Note_: Placeholder implementation provided, full implementation to follow in a later PR
