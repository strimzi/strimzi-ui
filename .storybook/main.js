/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

const devWebpackConfig = require('../utils/build/webpack.dev.js');

module.exports = {
  stories: ['../client/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-knobs',
    '@storybook/addon-actions',
    '@storybook/addon-storysource',
    '@storybook/addon-links',
    'storybook-readme',
  ],
  webpackFinal: (storybookWebpackConfig) => ({
    // Merge dev webpack config and storybook webpack config, with storybook
    // taking precedence, and ensuring module rules, plugins and resolve aliases
    // include the dev webpack settings.
    ...devWebpackConfig,
    ...storybookWebpackConfig,
    module: {
      rules: [
        ...devWebpackConfig.module.rules,
        ...storybookWebpackConfig.module.rules,
      ],
    },
    plugins: [...devWebpackConfig.plugins, ...storybookWebpackConfig.plugins],
    resolve: {
      ...storybookWebpackConfig.resolve,
      alias: {
        ...devWebpackConfig.resolve.alias,
        ...storybookWebpackConfig.resolve.alias,
      },
    },
  }),
};
