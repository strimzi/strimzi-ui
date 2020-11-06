/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

// server prod specific plugins and webpack configuration
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const {
  returnBasicConfigMergedWith,
  plugins,
  moduleLoaders,
  CONSTANTS,
} = require('./webpack.common.js');
const { HEADER_TEXT } = require('../utils/tooling/constants.js');
const { withTypeScriptModuleLoader } = moduleLoaders;
const { withWebpackBundleAnalyzerPlugin, withTsconfigPathsPlugin } = plugins;

const {
  PRODUCTION,
  SERVER_BUILD_DIR,
  SERVER_DIR,
  BUNDLE_ANALYSER_DIR,
} = CONSTANTS;

const prodSpecificConfig = {
  entry: `${SERVER_DIR}/main.ts`,
  mode: PRODUCTION,
  target: 'node', // build for node
  externals: [nodeExternals()], // ignore node_modules - production dependencies install as a part of docker build
  output: {
    path: SERVER_BUILD_DIR,
    filename: '[name].js',
  },
  module: {
    rules: [withTypeScriptModuleLoader('../server/tsconfig.json')],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false, // remove all comments
            preamble: HEADER_TEXT, // add strimzi licence to built JS
          },
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      name: false,
    },
  },
  plugins: [
    // include default bundle analysis
    withWebpackBundleAnalyzerPlugin({
      reportFilename: `${BUNDLE_ANALYSER_DIR}/server-report.json`,
    }),
  ],
  resolve: {
    plugins: [withTsconfigPathsPlugin({ configFile: 'server/tsconfig.json' })],
  },
};

module.exports = returnBasicConfigMergedWith(prodSpecificConfig);
