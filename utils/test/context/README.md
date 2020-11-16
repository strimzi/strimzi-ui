# Testing contexts

Testing contexts is an example of having common test logic that can be
abstracted away. Here, the function `renderWithContextProviders` has been
provided that extends the base rtl `render` function but can be given a list
of context providers and their values that will wrap the provided children.
Using this, a common render can be defined in a test file for contexts so that
each test only needs to worry about using a consumer. For example:

```typescript
render = (children) =>
  renderWithContextProviders(children, {}, [
    { provider: MyProvider1, value: providerValue1 },
    { provider: MyProvider2, value: providerValue2 },
  ]);
```

This can be defined in a test file so that tests can still use a `render`
function in the same way they usually would with rtl but these renders will be
wrapped in the providers defined in the above function.

## Available functions

- `renderWithContextProviders` - described above
- `renderWithConfigFeatureFlagContext` - uses `renderWithContextProviders` to render given JSX with a default `ConfigFeatureFlag` context provided
- `renderWithCustomConfigFeatureFlagContext` - same as `renderWithConfigFeatureFlagContext`, but allows a specific value for the `ConfigFeatureFlag` context to be provided
