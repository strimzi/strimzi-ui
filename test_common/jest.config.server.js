/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const merge = require('lodash.merge');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('../server/tsconfig.json');
const commonConfig = require('./jest.common.config');
const serverRoot = '<rootDir>/server';

const config = {
  displayName: 'server',
  testMatch: [`${serverRoot}/**/*.(spec|steps).[jt]s?(x)`],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      //Must resolve to same location as baseURL in tsconfig.json
      prefix: serverRoot,
    }),
  },
  globals: {
    'ts-jest': {
      tsconfig: `${serverRoot}/tsconfig.json`,
    },
  },
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', serverRoot], //Otherwise typescript's relative module parsing will not work
};

module.exports = merge({}, commonConfig, config);
