/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const { jestModuleMapper } = require('../utils/tooling/aliasHelper.js');

const config = {
  rootDir: '../',
  clearMocks: true,
  testTimeout: 10000, // required for server tests, which take ~3 seconds to start
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/e2e/',
    '/utils/',
    '/linting',
    '/build/',
    '/coverage/',
    '/.storybook/',
    '/test_common/',
    '/.github/',
    '/.out/',
  ],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.config.*',
    '!server/*.*',
    '!client/Bootstrap/index.ts',
  ],
  coverageReporters: ['json', 'text', 'lcov', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleDirectories: ['node_modules', 'client', 'server'],
  moduleFileExtensions: ['js', 'feature', 'ts'],
  testEnvironment: 'jsdom',
  testMatch: ['**/*.spec.ts', '**/*.steps.ts'],
  testPathIgnorePatterns: ['/e2e/'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      { configFile: './test_common/test.babel.js' },
    ],
  },
  moduleNameMapper: {
    ...jestModuleMapper,
  },
  setupFiles: ['<rootDir>/test_common/jest_cucumber_support/index.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/test_common/tsconfig.test.json',
    },
  },
};

module.exports = config;
