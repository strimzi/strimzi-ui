/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const rulesets = [
  'eslint:recommended',
  'plugin:react/recommended',
  'plugin:react-hooks/recommended',
  'plugin:@typescript-eslint/eslint-recommended',
  'plugin:@typescript-eslint/recommended',
];

const customRules = {
  // prefer spaces (2) over tabs for indentation - tab width can be changed, space cannot
  indent: ['error', 2],
  // all lines to have semicolons to end statements
  semi: ['error', 'always'],
};

// https://eslint.org/docs/user-guide/configuring
// config for all code written in js
module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    'jest/globals': true,
    'cypress/globals': true,
  },
  // extend recommended rule sets - combine with prettier config, which must go last to work properly
  extends: rulesets.concat(['prettier']),
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  plugins: ['react', 'jest', 'cypress', '@typescript-eslint'],
  // detect and use the version of react installed to guide rules used
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: customRules,
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        'react/prop-types': 'off',
      },
    },
    {
      files: ['**/*.js'], //Allow commonjs modules for js files
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
