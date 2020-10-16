/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const {
  serverCertificates,
  mockAdminCertificates,
} = require('../tooling/secureDevUtil.js');

// used in e2e, this is the UI server running as it would in a prod environment, but using mock admin/certificate config
module.exports = {
  client: {
    transport: {
      ...serverCertificates,
    },
  },
  proxy: {
    hostname: 'localhost',
    port: 9080,
    transport: {
      ...mockAdminCertificates,
    },
  },
};
