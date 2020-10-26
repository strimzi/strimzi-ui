# Hooks

This directory contains all re-usable custom [React Hooks](https://reactjs.org/docs/hooks-intro.html#motivation) implemented for use across this UI. Unlike Models, these hooks encapsulate re-usable/common logic views or models may want to utilise, such as translation capabilities.

## Test approach

Elements should be tested in a functional manor. See [Test Driven Development](../../docs/Test.md#style-of-test).

## Expected files

For a given Hook `useFoo`, the expected files are as follows:

```
Hooks/
  index.ts
  useFoo/
    README.md
    Hook.ts
```

Where:

- index.ts acts as a barrel file, exporting the hooks defined in the Hooks directory
- README.md is the readme for this hook, detailing design choices and usage
- Hook.ts is the hook implementation

## Implemented hooks

Hooks to be added here on implementation, with summary of purpose/usage and a link to it's README.
