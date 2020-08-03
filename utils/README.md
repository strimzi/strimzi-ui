<!--
 Copyright Strimzi authors.
 License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
-->

# Utils

This directory contains common helper code or configuration for a variety of purposes across the repo. Where applicable, common areas of help code are split out into their own directories, with their own READMEs. Consult these READMEs for more details about the code available, and their usage.

## Utilities available

- `constants.js` - file containing development/build time constants.
- `aliasHelper.js` - logic used to generate code aliases. Currently generates aliases for Webpack, but could also generate aliases for other tools, such as Jest.
