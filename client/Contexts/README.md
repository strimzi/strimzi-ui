# Contexts

This UI makes use of [React Context](https://reactjs.org/docs/context.html) for top level state management. This allows for data to be stored and accessed by any component without needing to prop drill values to that component. In addition, depending on use case, contexts can be used as a component or as a React Hook, allowing for integration of state where ever and however it is required. This directory contains all the custom React Context implementations used across this UI.

It is expected that when used in production Context Provider(s) will be used by the code contained in the [`Bootstrap`](../Bootstrap/README.md) directory. Consumers of the state could be either other [`Bootstrap`](../Bootstrap/README.md) components, or [`Panel`](../Panels/README.md) or [`Group`](../Groups/README.md) components.

## Test approach

Elements should be tested in a functional manor. See [Test Driven Development](../../docs/Test.md#style-of-test).

## Expected files

For a given new Context `FeatureFlagContext`, the expected files are as follows:

```
Contexts/
  index.ts
  FeatureFlagContext/
    README.md
    Context.ts
```

Where:

- index.ts acts as a barrel file, exporting all public elements of this context/the contexts contained in the Context directory
- README.md is the readme for this Context, detailing design choices and usage
- Context.ts is the implementation of this context

## Available contexts

- [`Introspect`](./Introspect/README.md) - responsible for fetching, parsing and providing the UI with the supported capabilities of the backend GraphQL server
