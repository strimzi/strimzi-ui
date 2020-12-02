# Models

This directory contains custom [React Hooks](https://reactjs.org/docs/hooks-intro.html#motivation). Unlike the [Hooks](../Hooks/README.md), these hooks encapsulate specific business logic for views to utilise.

## Test approach

Elements should be tested in a functional manor. See [Test Driven Development](../../docs/Test.md#style-of-test).

## Expected files

For a given model `useFoo`, the expected files are as follows:

```
Models/
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

- [`useTopics`](./useTopics/README.md) - a hook providing sub-hooks to administer Kafka topics via GraphQL queries.
