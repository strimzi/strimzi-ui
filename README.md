[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)
[![Twitter Follow](https://img.shields.io/twitter/follow/strimziio.svg?style=social&label=Follow&style=for-the-badge)](https://twitter.com/strimziio)

# Strimzi UI

This repository contains the Strimzi UI and its implementation.
Strimzi UI provides a way for managing Strimzi and Kafka clusters (+ other components) deployed by it using a graphical user interface.

## Getting started

This UI uses `npm` to provide dependency management. If you wish to develop the UI, you will need:

- [npm version 6.4.1 or later](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [node 10.15.0 or later](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Once these prerequisites are met, all required dependencies to build and run the UI can be downloaded by running the following command:

```
npm install
```

If you run into any issues while working in this repo, please check out [the troubleshooting guide](#troubleshooting).

### Helpful commands

`npm` scripts are provided for common tasks. These include:

- `npm run start` - runs the UI client and server in development mode
- `npm run build` - builds the UI
- `npm run clean` - deletes the build/generated content directories
- `npm run lint` - lints the codebase. See [`Linting`](./docs/Linting.md) for the individual linting steps
- `npm run storybook` - runs [Storybook](./docs/Architecture.md#storybook) for the UI components.

## Implementation documentation

Further details around how this UI is implemented can be found below:

- [Architecture](./docs/Architecture.md)
- [Build](./docs/Build.md)
- [Linting](./docs/Linting.md)
- [Test](./docs/Test.md)
- [Contribution](./docs/Contribution.md)

## Troubleshooting

Currently there are no known issues.
