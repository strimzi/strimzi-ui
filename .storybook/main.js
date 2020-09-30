/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
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
};
