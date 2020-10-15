/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const path = require('path');
const { webpackAliases } = require('../utils/tooling/aliasHelper.js');
const { PRODUCTION, DEVELOPMENT } = require('../utils/tooling/constants.js');
const babelPresets = require('./babelPresets.js');

// constants
const UI_TITLE = 'Strimzi UI';
const BUILD_DIR = path.resolve(__dirname, '../dist');
const GENERATED_DIR = path.resolve(__dirname, '../generated');
const BUNDLE_ANALYSER_DIR = `${GENERATED_DIR}/bundle-analyser/`;
const BOOTSTRAP_DIR = path.resolve(__dirname, '../client/Bootstrap/');
const IMAGES_DIR = path.resolve(__dirname, '../client/Images');

// common plugin imports/functions to wrap them with common default config
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const returnPluginWithConfig = (plugin, defaultConfig = {}) => (
  customConfig = {}
) =>
  new plugin({
    ...defaultConfig,
    ...customConfig,
  });

const withHTMLPlugin = returnPluginWithConfig(HtmlPlugin, {
  filename: 'index.html', // name of output file
  template: `${BOOTSTRAP_DIR}/index.html`, // source template
  title: UI_TITLE, // HTML title
  favicon: `${IMAGES_DIR}/favicon.ico`, // favicon for this page
  inject: 'head', // any/all built content linked into HTML head element
});

const withMiniCssExtractPlugin = returnPluginWithConfig(MiniCssExtractPlugin, {
  filename: '[name].css', // name of css file
  chunkFilename: '[name].bundle.css', // if chunked, the chunk's filename
});

const withWebpackBundleAnalyzerPlugin = returnPluginWithConfig(
  BundleAnalyzerPlugin,
  {
    analyzerMode: 'json', // produce json output by default
    reportFilename: `${BUNDLE_ANALYSER_DIR}/report.json`,
    openAnalyzer: false, // do not auto open analyser tool
  }
);

// common rules configuration
const returnModuleRuleWithConfig = (defaultConfig = {}, defaultUse = []) => (
  customUse = [],
  customConfig = {}
) => ({
  ...defaultConfig,
  ...customConfig,
  use: [...customUse, ...defaultUse],
});

// you will need to provide either style-loader or MiniCssExtractPlugin.loader if prod
const withStylingModuleLoader = returnModuleRuleWithConfig(
  {
    test: /(\.css|.scss)$/,
    sideEffects: true, // the css loader requires sideEffects true, else no built css is emitted
  },
  [
    {
      loader: 'css-loader',
    },
    {
      loader: 'sass-loader',
      options: {
        sassOptions: {
          includePaths: ['node_modules'],
        },
      },
    },
  ]
);

const withJSModuleLoader = returnModuleRuleWithConfig(
  {
    test: /\.(jsx|js)?$/,
    exclude: /(node_modules)/,
  },
  [
    {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        presets: babelPresets,
      },
    },
  ]
);

const withFontModuleLoader = returnModuleRuleWithConfig(
  {
    test: /\.(woff(2)?|ttf|eot)$/,
  },
  [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        publicPath: '/fonts/',
        outputPath: 'fonts/',
      },
    },
  ]
);

const withImageModuleLoader = returnModuleRuleWithConfig(
  {
    test: /\.(jpg|gif|png|svg)$/,
  },
  [
    {
      loader: 'file-loader',
      options: {
        publicPath: '/images/',
        outputPath: 'images/',
      },
    },
  ]
);

// exported helper function - returns common configuration, merged via object spread. Provided options take precedence
const returnBasicConfigMergedWith = (customConfigurationForBuildMode = {}) => ({
  entry: `${BOOTSTRAP_DIR}/index.js`,
  output: {
    path: BUILD_DIR,
    publicPath: '',
    filename: '[name].bundle.js',
  },
  module: {
    // given the dynamic nature of rules and configuration, none a re provided by default. Use the exported `moduleLoaders` to return loaders with some default configs
    rules: [],
  },
  // given different build modes will require different plugins/plugin configuration, none are provided by default. Use the exported `plugins` for commonly used plugins with default configuration
  plugins: [],
  resolve: {
    alias: webpackAliases,
  },
  ...customConfigurationForBuildMode,
});

module.exports = {
  returnBasicConfigMergedWith,
  plugins: {
    withHTMLPlugin,
    withMiniCssExtractPlugin,
    withWebpackBundleAnalyzerPlugin,
  },
  moduleLoaders: {
    withStylingModuleLoader,
    withJSModuleLoader,
    withFontModuleLoader,
    withImageModuleLoader,
  },
  CONSTANTS: {
    UI_TITLE,
    PRODUCTION,
    DEVELOPMENT,
    BUILD_DIR,
    BOOTSTRAP_DIR,
    IMAGES_DIR,
    GENERATED_DIR,
    BUNDLE_ANALYSER_DIR,
  },
};
