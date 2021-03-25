/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const {
  serverCertificates,
  mockAdminCertificates,
  devEnvValues,
} = require('../tooling/runtimeDevUtils.js');
const { devServer, mockadminServer } = devEnvValues;

// used in e2e, this is the UI server running as it would in a prod environment, but using mock admin/certificate config
module.exports = {
  client: {
    transport: {
      ...serverCertificates,
    },
  },
  logging: {
    level: 'debug',
    prettyPrint: {
      translateTime: true,
    },
  },
  modules: {
    api: true,
    client: true,
    config: true,
    log: true,
    mockapi: false,
    security: true,
  },
  proxy: {
    ...mockadminServer,
    transport: {
      ...mockAdminCertificates,
    },
    authentication: {
      type: 'none',
      //   type: 'oauth',
      //   discoveryURL:
      //     'http://localhost:8080/auth/realms/master/.well-known/openid-configuration',
      //   clientID: 'test',
      //   clientSecret: '09687ae6-4d4f-4147-85dd-11abf2122022',
      //   callbackURL: 'http://localhost:3000/auth/callback',
    },
  },
  ...devServer,
};
