/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { default as cucumber } from 'cypress-cucumber-preprocessor';

module.exports = (on: Cypress.PluginEvents) => {
  const options = {
    typescript: require.resolve('typescript'),
  };

  on('file:preprocessor', cucumber.default(options));
};
