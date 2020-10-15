/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const { jestModuleMapper } = require('../utils/tooling/aliasHelper');
const { resolve } = require('path');
const config = {
  rootDir: '../',
  moduleDirectories: ['node_modules'],
  clearMocks: true,
  testTimeout: 10000, // required for server tests, which take ~3 seconds to start
  setupFiles: [resolve(__dirname, 'jest_cucumber_support/index.ts')],
  preset: 'ts-jest/presets/js-with-ts',
  moduleNameMapper: {
    ...jestModuleMapper,
  },
};

module.exports = config;
