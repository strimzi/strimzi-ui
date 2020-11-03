/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

// client production specific plugins and webpack configuration
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BannerPlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const {
  returnBasicConfigMergedWith,
  plugins,
  moduleLoaders,
  CONSTANTS,
} = require('./webpack.common.js');

const { HEADER_TEXT } = require('../utils/tooling/constants.js');
const {
  withStylingModuleLoader,
  withFontModuleLoader,
  withImageModuleLoader,
  withTypeScriptModuleLoader,
} = moduleLoaders;
const {
  withHTMLPlugin,
  withNormalModuleReplacementPlugin,
  withMiniCssExtractPlugin,
  withWebpackBundleAnalyzerPlugin,
  withTsconfigPathsPlugin,
} = plugins;

const { PRODUCTION, CLIENT_BUILD_DIR, BUNDLE_ANALYSER_DIR } = CONSTANTS;

const prodSpecificConfig = {
  mode: PRODUCTION,
  output: {
    path: CLIENT_BUILD_DIR,
    publicPath: '',
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      withStylingModuleLoader([
        {
          loader: MiniCssExtractPlugin.loader,
        },
      ]),
      withTypeScriptModuleLoader('../client/tsconfig.json'),
      withFontModuleLoader(),
      withImageModuleLoader(),
    ],
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
          mangle: {
            safari10: true,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    splitChunks: {
      chunks: 'all',
      name: false,
    },
  },
  plugins: [
    withHTMLPlugin({
      // html plugin custom minification settings
      minify: {
        collapseWhitespace: true,
        removeComments: false, // keep the copyright header
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    withNormalModuleReplacementPlugin(),
    withMiniCssExtractPlugin(),
    // gzip compress all built js output
    new CompressionPlugin({
      test: /\\*\.js$/, // apply only on js files
      filename: '[path].gz[query]', // output file name
      algorithm: 'gzip', // compress via gzip
      threshold: 0, // applies to all files
      minRatio: 0.8, // keep compressed file if smaller by this %
    }),
    // add copyright to css files(other files already have the header)
    new BannerPlugin({
      banner: `${HEADER_TEXT}`,
      test: /.css/,
      raw: true,
    }),
    // include default bundle analysis
    withWebpackBundleAnalyzerPlugin({
      reportFilename: `${BUNDLE_ANALYSER_DIR}/client-report.json`,
    }),
  ],
  resolve: {
    plugins: [withTsconfigPathsPlugin({ configFile: 'client/tsconfig.json' })],
  },
};

module.exports = returnBasicConfigMergedWith(prodSpecificConfig);
