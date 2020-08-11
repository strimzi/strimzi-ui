/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

const {
  returnBasicConfigMergedWith,
  plugins,
  moduleLoaders,
  CONSTANTS,
} = require('./webpack.common.js');
const {
  withHTMLPlugin,
  withMiniCssExtractPlugin,
  withWebpackBundleAnalyzerPlugin,
} = plugins;
const {
  withStylingModuleLoader,
  withJSModuleLoader,
  withFontModuleLoader,
  withImageModuleLoader,
} = moduleLoaders;
const { DEVELOPMENT, BUILD_DIR, BUNDLE_ANALYSER_DIR } = CONSTANTS;

const devHostname = process.env.DEV_HOSTNAME || 'localhost';
const devPort = process.env.DEV_PORT || 8080;

const devSpecificConfig = {
  mode: DEVELOPMENT,
  module: {
    rules: [
      withStylingModuleLoader(['style-loader']),
      withJSModuleLoader(),
      withFontModuleLoader(),
      withImageModuleLoader(),
    ],
  },
  plugins: [
    withHTMLPlugin(),
    withMiniCssExtractPlugin({
      hmr: true, // enable hmr as well as standard config
    }),
    withWebpackBundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: `${BUNDLE_ANALYSER_DIR}/bundles.html`, // when in dev mode, produce a static html file
    }),
  ],
  devServer: {
    contentBase: [BUILD_DIR, BUNDLE_ANALYSER_DIR], // static content from the build directory, but also the output of the WebpackBundleAnalyzer configured above (access via /bundles.html)
    watchContentBase: true,
    compress: true,
    inline: true,
    hot: true,
    host: devHostname,
    port: devPort,
    overlay: {
      warnings: false,
      errors: true,
    },
  },
};

module.exports = returnBasicConfigMergedWith(devSpecificConfig);
