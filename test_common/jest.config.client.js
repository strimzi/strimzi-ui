/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const merge = require('lodash.merge');
const { resolve } = require('path');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('../client/tsconfig.json');
const commonConfig = require('./jest.common.config');
const clientRoot = '<rootDir>/client';

const config = {
  displayName: 'client',
  setupFilesAfterEnv: [resolve(__dirname, 'jest_rtl_setup.ts')],
  testMatch: [`${clientRoot}/**/*.(spec|steps).[jt]s?(x)`],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      //Must resolve to same location as baseURL in tsconfig.json
      prefix: clientRoot,
    }),
  },
  globals: {
    'ts-jest': {
      tsconfig: `${clientRoot}/tsconfig.json`,
    },
  },
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', clientRoot], //Otherwise typescript's relative module parsing will not work
};

module.exports = merge({}, commonConfig, config);
