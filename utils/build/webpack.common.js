/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const path = require('path');
const {
    webpackAliases
} = require('../aliasHelper.js');
const babelPresets = require('./babelPresets.js');
const merge = require('lodash.merge');

// common plugins
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

// constants
const PRODUCTION = 'production';
const DEVELOPMENT = 'development';
const BUILD_DIR = path.resolve(__dirname, '../../dist');
const BOOTSTRAP_DIR = path.resolve(__dirname, '../../client/Bootstrap/');
const IMAGES_DIR = path.resolve(__dirname, '../../client/Images');

// helper function - returns common configuration, merged (via lodash) with any provided options
const returnWebpackConfigFor = (buildMode = DEVELOPMENT, customConfigurationForBuildMode = {}) => merge({
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
                    buildMode === DEVELOPMENT ?
                    'style-loader' : {
                        loader: MiniCssExtractPlugin.loader,
                    },
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
                        outputPath: '/fonts/',
                    },
                }, ],
            },
            {
                test: /\.(jpg|gif|png|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        publicPath: '/images/',
                        outputPath: '/images/',
                    },
                }, ],
            },
        ]
    },
    plugins: [
        new HtmlPlugin({
            filename: 'index.html',
            template: `${BOOTSTRAP_DIR}/index.html`,
            title: 'Strimzi UI',
            favicon: `${IMAGES_DIR}/favicon.ico`,
            inject: 'head',
            minify: {
                collapseWhitespace: true,
                removeComments: false, // keep the copyright header
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
              }
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].bundle.css',
            hmr: buildMode === DEVELOPMENT,
        }),
        new CompressionPlugin({
            test: /\\*\.js$/,
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            threshold: 0,
            minRatio: 0.8
        })
    ],
    resolve: {
        alias: webpackAliases
    }
}, customConfigurationForBuildMode);

module.exports = {
    returnWebpackConfigFor,
    CONSTANTS: {
        PRODUCTION,
        DEVELOPMENT,
        BUILD_DIR,
        BOOTSTRAP_DIR,
        IMAGES_DIR
    }
};