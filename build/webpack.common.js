/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const path = require('path');
const webpack = require('webpack');
const merge = require('lodash.merge');
const { PRODUCTION, DEVELOPMENT } = require('../utils/tooling/constants.js');

// constants
const UI_TITLE = 'Strimzi UI';
const ROOT_DIR = path.resolve(__dirname, '../');
const BUILD_DIR = path.resolve(__dirname, `${ROOT_DIR}/dist`);
const CLIENT_BUILD_DIR = path.resolve(__dirname, `${BUILD_DIR}/client`);
const SERVER_BUILD_DIR = path.resolve(__dirname, `${BUILD_DIR}/server`);
const GENERATED_DIR = path.resolve(__dirname, `${ROOT_DIR}/generated`);
const BUNDLE_ANALYSER_DIR = `${GENERATED_DIR}/bundle-analyser/`;
const BOOTSTRAP_DIR = path.resolve(__dirname, `${ROOT_DIR}/client/Bootstrap/`);
const IMAGES_DIR = path.resolve(__dirname, `${ROOT_DIR}/client/Images`);
const SERVER_DIR = path.resolve(__dirname, `${ROOT_DIR}/server/`);

// common plugin imports/functions to wrap them with common default config
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

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
  inject: true,
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

const withTsconfigPathsPlugin = returnPluginWithConfig(TsconfigPathsPlugin, {});

const withNormalModuleReplacementPlugin = () =>
  new webpack.NormalModuleReplacementPlugin(/.carbon./, (resource) => {
    const viewLayer = (process.env.VL || 'carbon').toLowerCase();
    resource.request = resource.request.replace('carbon', viewLayer);
  });

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

const withTypeScriptModuleLoader = (tsConfigFile) =>
  returnModuleRuleWithConfig(
    {
      test: /\.(t|j)sx?$/,
      exclude: /(node_modules)/,
    },
    [
      {
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(
            __dirname,
            tsConfigFile || 'tsconfig.common.json'
          ),
          onlyCompileBundledFiles: true,
        },
      },
    ]
  )();

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
const returnBasicConfigMergedWith = (customConfigurationForBuildMode = {}) =>
  merge(
    {
      entry: `${BOOTSTRAP_DIR}/index.tsx`,
      target: 'web', // build for browsers (Webpack default)
      output: {
        path: BUILD_DIR,
        publicPath: '',
        filename: '[name].bundle.js',
      },
      module: {
        // given the dynamic nature of rules and configuration, none are provided by default. Use the exported `moduleLoaders` to return loaders with some default configs
        rules: [],
      },
      // given different build modes will require different plugins/plugin configuration, none are provided by default. Use the exported `plugins` for commonly used plugins with default configuration
      plugins: [],
      resolve: {
        plugins: [],
        alias: {},
        extensions: ['.ts', '.tsx', '.js', '.json'],
      },
    },
    customConfigurationForBuildMode
  );

module.exports = {
  returnBasicConfigMergedWith,
  plugins: {
    withHTMLPlugin,
    withNormalModuleReplacementPlugin,
    withMiniCssExtractPlugin,
    withWebpackBundleAnalyzerPlugin,
    withTsconfigPathsPlugin,
  },
  moduleLoaders: {
    withStylingModuleLoader,
    withFontModuleLoader,
    withImageModuleLoader,
    withTypeScriptModuleLoader,
  },
  CONSTANTS: {
    UI_TITLE,
    PRODUCTION,
    DEVELOPMENT,
    BUILD_DIR,
    CLIENT_BUILD_DIR,
    SERVER_BUILD_DIR,
    BOOTSTRAP_DIR,
    IMAGES_DIR,
    GENERATED_DIR,
    BUNDLE_ANALYSER_DIR,
    SERVER_DIR,
  },
};
