/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

// https://prettier.io/docs/en/options.html
const customRules = {
  semi: true,
  tabWidth: 2, // use 2 spaces for indentation - not an ideal variable name
  singleQuote: true,
  jsxSingleQuote: true,
};

module.exports = {
  ...customRules,
};
