/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const { resolve } = require('path');

module.exports = {
  rootDir: '../',
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  collectCoverageFrom: [
    '(client|server)/**/*.{js,ts,jsx,tsx}',
    '!**/index.{js,ts,jsx,tsx}',
    '!**/*.steps.*',
    '!**/*.d.ts',
    '!**/test_common/**',
    '!**/server/*',
    '!**/Home.tsx',
  ],
  projects: [
    resolve(__dirname, 'jest.config.client.js'),
    resolve(__dirname, 'jest.config.server.js'),
  ],
};
