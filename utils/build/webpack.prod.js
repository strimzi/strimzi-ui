/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

// prod specific plugins and webpack configuration
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const { returnWebpackConfigFor, CONSTANTS } = require('./webpack.common.js');
const { STRIMZI_HEADER } = require('../constants.js');

const {PRODUCTION} = CONSTANTS;

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
};

module.exports = returnWebpackConfigFor(PRODUCTION, prodSpecificConfig);