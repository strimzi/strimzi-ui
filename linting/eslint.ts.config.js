/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

// import the core js eslint configuration
const eslintjsconfig = require('./eslint.js.config.js');
// extend the rules to include TS specific rules
const tsRulesets = ['plugin:@typescript-eslint/recommended'].concat(
  eslintjsconfig.extends
);

// https://eslint.org/docs/user-guide/configuring
// config for all code written in .ts
module.exports = {
  ...eslintjsconfig,
  extends: tsRulesets,
  parser: '@typescript-eslint/parser', // use TS parser
  plugins: eslintjsconfig.plugins.concat(['@typescript-eslint']), // and TS plugin
  // ignore any js files - this is linting for ts files only
  ignorePatterns: eslintjsconfig.ignorePatterns.concat(['**/*.js']),
};
