# Build

This directory contains code relating to the building of the UI at dev and production build time. [Full details on how the build has been set up can be found here.](../../docs/Build.md). The intent is as much configuration is shared as possible from `webpack.common.js`, and the function it exports, `returnWebpackConfigFor`. This allows the various build modes to define just the configuration they need to, thus keeping the configuration purposfull/readable both in that file, and in common. If a new build mode is added, it should follow the form set by the `webpack.dev.js` and `webpack.prod.js`.

## Files

- `webpack.common.js` - contains common webpack configuration and helper functions. These are:
  - `returnWebpackConfigFor` - a function which returns common configuration options. Any of these can be overriden if required. Check the file for parameters/usage.
  - `plugins` - an object which contains functions which return the various plugins used across more than one build mode, with a common minimum configuration. These should be imported and called in a build mode's `plugins` array, with custom config passed to suit that mode. Any common plugins should be provided/used this way, as it allows easy modification/extension, while keeping a sensible set of default values.
  - `CONSTANTS` - an object which contains useful values for use in any build mode
- `webpack.dev.js` - webpack development build mode. Stands up a configured instance of `webpack-dev-server` to suppliment the common config/to enable faster development.
- `webpack.prod.js` - webpack production build mode. Contains configuration to minify and compress all built output.
- `babelPresets.js` - babel transpiling configuration. See comments in the file which detail what options/plugins are in use.