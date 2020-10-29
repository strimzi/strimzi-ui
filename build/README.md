# Build

This directory contains code relating to the building of the UI at dev and production build time. [Full details on how the build has been set up can be found here.](../docs/Build.md). The intent is as much configuration is shared as possible from `webpack.common.js`, and the function it exports, `returnBasicConfigMergedWith`. This allows the various build modes to define (in an additive manner) just the configuration they need to, thus keeping the configuration purposeful/readable both in that file, and in common. If a new build mode is added, it should follow the form set by the `webpack.dev.js` and `webpack.prod.js`.

## Files

- `webpack.common.js` - contains common webpack configuration and helper functions. These are:
  - `returnBasicConfigMergedWith` - a function which returns common configuration options. Any of these can be overridden if required. Check the file for parameters/usage.
  - `moduleLoaders` - an object containing functions that will return module loading rules. These should be called when defining a build mode's `module.rules` value. The functions provided allow for custom values to be provided - see `webpack.common.js` for usage. Any common loaders should be provided/used this way, as it allows easy modification/extension, while keeping a sensible set of default values.
  - `plugins` - an object which contains functions which return the various plugins used across more than one build mode, with a common minimum configuration. These should be imported and called in a build mode's `plugins` array, with custom config passed to suit that mode. Any common plugins should be provided/used this way, as it allows easy modification/extension, while keeping a sensible set of default values.
  - `CONSTANTS` - an object which contains useful values for use in any build mode
- `webpack.client.dev.js` - webpack development build mode. Stands up a configured instance of `webpack-dev-server` to supplement the common config/to enable faster development.
- `webpack.client.prod.js` - webpack production build mode for client code. Contains configuration to minify and compress all built output.
- `webpack.server.prod.js` - webpack production build mode for server code. Contains configuration to minify and compress all built output.
- `babelPresets.js` - babel transpiling configuration. See comments in the file which detail what options/plugins are in use.
- `dockerfile` - a dockerfile which builds the Strimzi-ui, and when run hosts it on port 3000
