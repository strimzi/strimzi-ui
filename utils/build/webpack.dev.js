/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

const { returnWebpackConfigFor, CONSTANTS } = require('./webpack.common.js');

const {DEVELOPMENT, BUILD_DIR} = CONSTANTS;

const devSpecificConfig = {
    devServer: {
        contentBase: BUILD_DIR,
        watchContentBase: true,
        compress: true,
        inline: true,
        hot: true,
        overlay: {
            warnings: false,
            errors: true
        }
    }
};

module.exports = returnWebpackConfigFor(DEVELOPMENT, devSpecificConfig);