# Hooks

This directory contains all re-usable custom [React Hooks](https://reactjs.org/docs/hooks-intro.html#motivation) implemented for use across this UI. Unlike Models, these hooks encapsulate re-usable/common logic views or models may want to utilise, such as translation capabilities.

## Test approach

Elements should be tested in a functional manor. See [Test Driven Development](../../docs/Test.md#style-of-test).

## Expected files

For a given Hook `useFoo`, the expected files are as follows:

```
Hooks/
  index.ts
  types.ts
  useFoo/
    README.md
    useFoo.ts
    useFoo.spec.ts
    useFoo.assets.ts
    useFoo.types.ts
```

Where:

- index.ts acts as a barrel file, exporting the hooks defined in the Hooks directory
- types.ts acts as a barrel file, exporting all the public types of each context
- README.md is the readme for this hook, detailing design choices and usage
- useFoo.ts is the hook implementation
- useFoo.spec.ts are the tests for this hook
- useFoo.assets.ts are the test assets for this hook
- useFoo.types.ts are the types for this hook

## Implemented hooks

- [`useConfigFeatureFlag`](./useConfigFeatureFlag/README.md) - a hook providing consumer access to the `ConfigFeatureFlag` context, containing configuration and feature flag state
- [`useLogger`](./useLogger/README.md) - sends client log messages to the WebSocket listener on the server `/log` endpoint.
