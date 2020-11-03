/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { default as cucumber } from 'cypress-cucumber-preprocessor';

module.exports = (on: (evt: string, callback: () => void) => void) => {
  const options = {
    typescript: require.resolve('typescript'),
  };

  const cucumberPreProcessor = cucumber.default;

  on('file:preprocessor', cucumberPreProcessor(options));
};
