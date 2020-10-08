# End to End testing

This directory contains everything you need to write End-to-End tests. Please find documentation for E2E testing [here](../../docs/Test.md#end-to-end-testing).

## Contents

- [features](./features/README.md) - this directory contains all of the cucumber feature files. It has a subdirectory called `step_definitions` that contains all of the step definitions for those feature files.
- [plugins](./plugins/README.md) - this directory contains a single `index.ts` file where all cypress plugins are imported and attatched. If a new plugin needs to be added, this is where it needs to be installed.
- [support](./support/README.md) - this directory contains a `index.ts` file that is imported by cypress globally so anything defined here can be used across all tests.
