/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const merge = require('lodash.merge');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { jestModuleMapper } = require('../utils/tooling/aliasHelper');
const { compilerOptions } = require('./tsconfig.json');
const commonConfig = require('../test_common/jest.common.config');

const config = {
  testMatch: ['<rootDir>/**/*.(spec|steps).[jt]s?(x)'],
  coverageDirectory: '<rootDir>/../coverage/server',
  testEnvironment: 'node',
  collectCoverageFrom: [
    '<rootDir>/**/*.{js,ts,jsx,tsx}',
    '!**/index.{js,ts,jsx,tsx}',
    '!**/*.steps.*',
    '!**/*.d.ts',
    '!jest.config.js',
    '!**/test_common/**',
    '!*',
  ],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths),
    ...jestModuleMapper,
  },
};

module.exports = merge({}, commonConfig, config);
