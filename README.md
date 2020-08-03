<!--
 Copyright Strimzi authors.
 License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
-->

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

- `npm run start` - runs the UI in development mode
- `npm run build` - builds the UI
- `npm run clean` - deletes the build/generated content directories
- `npm run lint` - lints the codebase. See [`Linting`](./docs/Linting.md) for the individual linting steps

## Implementation documentation

Further details around how this UI is implemented can be found below:

- [Build](./docs/Build.md)
- [Linting](./docs/Linting.md)

### Troubleshooting

#### `Signed-off-by` reported as not included in commit, when it is included

When making a commit, your commit message may look as follows:

```
feat: new feature

- adds feature X

Signed-off-by: Matthew <matthew@domain>

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      <date>
#
# On branch X
# Changes to be committed:
#	modified:   file
```

but this is rejected by commitlint:

```
husky > commit-msg (node v10.15.0)
⧗   input: feat: new feature

- adds feature X

Signed-off-by: Matthew <matthew@domain>
✖   message must be signed off [signed-off-by]

✖   found 1 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint
```

This is due to [this bug](https://github.com/conventional-changelog/commitlint/issues/1809), where comments are parsed/not ignored. While this issues exists, you can work around this by removing all comments from your message, ie:

```
feat: new feature

- adds feature X

Signed-off-by: Matthew <matthew@domain>

```
