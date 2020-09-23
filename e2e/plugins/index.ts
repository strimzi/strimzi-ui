/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const cucumber = require('cypress-cucumber-preprocessor').default;

module.exports = (on: Function) => {
  const options = {
    typescript: require.resolve('typescript'),
  };

  on('file:preprocessor', cucumber(options));
};
