/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const {
  mockAdminCertificates,
  devEnvValues,
} = require('../tooling/runtimeDevUtils.js');
const { mockadminServer } = devEnvValues;

module.exports = {
  authentication: {
    strategy: 'none',
  },
  client: {
    transport: {
      ...mockAdminCertificates,
    },
  },
  modules: {
    api: false,
    client: false,
    config: true,
    mockapi: true,
  },
  proxy: {
    transport: {},
  },
  logging: true,
  ...mockadminServer,
};
