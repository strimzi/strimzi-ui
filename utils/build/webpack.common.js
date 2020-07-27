/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const path = require('path');
const {
    webpackAliases
} = require('../aliasHelper.js');
const {
    PRODUCTION,
    DEVELOPMENT
} = require('../constants.js');
const babelPresets = require('./babelPresets.js');
const mergeWith = require('lodash.mergewith');

// constants
const UI_TITLE = 'Strimzi UI';
const BUILD_DIR = path.resolve(__dirname, '../../dist');
const GENERATED_DIR = path.resolve(__dirname, '../../generated');
const BUNDLE_ANALYSER_DIR = `${GENERATED_DIR}/bundle-analyser/`;
const BOOTSTRAP_DIR = path.resolve(__dirname, '../../client/Bootstrap/');
const IMAGES_DIR = path.resolve(__dirname, '../../client/Images');

// common plugin imports/functions to wrap them with common default config
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const returnPluginWithConfig = (plugin, defaultConfig = {}) => (customConfig = {}) => new plugin({
    ...defaultConfig,
    ...customConfig
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

const withWebpackBundleAnalyzerPlugin = returnPluginWithConfig(BundleAnalyzerPlugin, {
    analyzerMode: 'json', // produce json output by default
    reportFilename: `${BUNDLE_ANALYSER_DIR}/report.json`,
    openAnalyzer: false // do not auto open analyser tool
});

/**
 * merge doesnt combine arrays nicely - ie index 0 will overwrite existing index 0. Thus, if an array, merge all entries and reduce by 
 * name so we get a single set of unique object entries. If not an array, return undefined, and normal merge behaviour will trigger.
 */
const configurationCombiner = (objValue, srcValue) => {
    let combinedResult = undefined;
    if (Array.isArray(objValue) && Array.isArray(srcValue)) {
        combinedResult = Array.from( // get an arrray from
            new Map( // a map which is given an array of key value pairs from
                objValue.concat(srcValue) // merging the current array and the new array we are combining
                .map(content => ([content.constructor.name, content]))) // using the name of the value as the key, and itself as the value
            .values()); //and get the may as an iterable so it can be converted to an array
    }
    return combinedResult;
};

// exported helper function - returns common configuration, merged (via lodash) with any provided options. Provided options take precedence
const returnWebpackConfigFor = (buildMode = DEVELOPMENT, customConfigurationForBuildMode = {}) => mergeWith({
    entry: `${BOOTSTRAP_DIR}/index.js`,
    mode: buildMode === PRODUCTION ? PRODUCTION : DEVELOPMENT,
    output: {
        path: BUILD_DIR,
        publicPath: '',
        filename: '[name].bundle.js',
    },
    module: {
        rules: [{
                test: /(\.css|.scss)$/,
                sideEffects: true, // the css loader requires sideEffects true, else no built css is emitted
                use: [
                    // if production, use the loader from MiniCssExtractPlugin - else style-loader (for hmr/speed). Done here (rather than individual files) for ease of merging given this one delta.
                    buildMode === PRODUCTION ? {
                        loader: MiniCssExtractPlugin.loader,
                    } : 'style-loader',
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
                ],
            }, {
                test: /\.(jsx|js)?$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: babelPresets,
                    },
                }, ],
            },
            {
                test: /\.(woff(2)?|ttf|eot)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: '/fonts/',
                        outputPath: 'fonts/',
                    },
                }, ],
            },
            {
                test: /\.(jpg|gif|png|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        publicPath: '/images/',
                        outputPath: 'images/',
                    },
                }, ],
            },
        ]
    },
    plugins: [
        withHTMLPlugin(),
        withMiniCssExtractPlugin(),
    ],
    resolve: {
        alias: webpackAliases
    }
}, customConfigurationForBuildMode, configurationCombiner);

module.exports = {
    returnWebpackConfigFor,
    plugins: {
        withHTMLPlugin,
        withMiniCssExtractPlugin,
        withWebpackBundleAnalyzerPlugin
    },
    CONSTANTS: {
        UI_TITLE,
        PRODUCTION,
        DEVELOPMENT,
        BUILD_DIR,
        BOOTSTRAP_DIR,
        IMAGES_DIR,
        GENERATED_DIR,
        BUNDLE_ANALYSER_DIR
    }
};