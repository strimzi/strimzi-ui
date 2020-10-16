/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const {
  serverCertificates,
  mockAdminCertificates,
} = require('../tooling/secureDevUtil.js');

module.exports = {
  client: {
    transport: {
      ...serverCertificates,
    },
  },
  modules: {
    api: true,
    client: false,
    config: true,
    log: true,
    mockapi: false,
  },
  proxy: {
    hostname: 'localhost',
    port: 9080,
    transport: {
      ...mockAdminCertificates,
    },
  },
};
