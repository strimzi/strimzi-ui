/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

// prod specific plugins and webpack configuration
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const {
    returnWebpackConfigFor,
    plugins,
    CONSTANTS
} = require('./webpack.common.js');
const {
    STRIMZI_HEADER
} = require('../constants.js');
const {
    withHTMLPlugin,
    withWebpackBundleAnalyzerPlugin
} = plugins;

const {
    PRODUCTION
} = CONSTANTS;

const prodSpecificConfig = {
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: false, // remove all comments
                        preamble: STRIMZI_HEADER // add strimzi licence to built JS
                    },
                    keep_classnames: true,
                    keep_fnames: true,
                    mangle: {
                        safari10: true
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            chunks: 'all',
            name: false,
        }
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
                useShortDoctype: true
            }
        }),
        // gzip compress all built js output
        new CompressionPlugin({
            test: /\\*\.js$/, // apply only on js files
            filename: '[path].gz[query]', // output file name
            algorithm: 'gzip', // compress via gzip
            threshold: 0, // applies to all files
            minRatio: 0.8 // keep compressed file if smaller by this %
        }),
        // include default bundle analysis
        withWebpackBundleAnalyzerPlugin()
    ]
};

module.exports = returnWebpackConfigFor(PRODUCTION, prodSpecificConfig);