/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const tsRulesets = [
  'plugin:@typescript-eslint/eslint-recommended',
  'plugin:@typescript-eslint/recommended',
];

// https://eslint.org/docs/user-guide/configuring
// config for all code written in ts
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsConfigRootDir: '../',
  },
  plugins: ['@typescript-eslint'],
  files: ['**/*.ts', '**/*.tsx'],
  extends: tsRulesets,
  rules: {
    'react/prop-types': 'off',
  },
};
