# Tooling

This directory contains any code that is used for development coding. For example, code that aids linting or the Webpack build process.

## Contents

- [headers](./headers/README.md) - header to be inserted at the top of every file.
- `constants.js` - constants used in the build process/at develop time
- `aliasHelper.js` - generates aliases for webpack/jest for modules in the UI
- `runtimeDevUtils.js` - helper code used by development server configuration/webpack dev serer
- `generateCerts.sh` - bash script which via `openssl` creates development certificates to be used by the mock and strimzi ui server in development
