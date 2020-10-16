/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const { mockAdminCertificates } = require('../tooling/secureDevUtil.js');

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
    hostname: 'localhost',
    port: 3000,
    transport: {},
  },
  logging: true,
  hostname: '0.0.0.0',
  port: 9080,
};
