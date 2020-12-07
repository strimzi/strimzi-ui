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
    client: false,
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
      type: 'oauth',
      discoveryURL:
        'http://localhost:8080/auth/realms/master/.well-known/openid-configuration',
      clientID: 'test',
      clientSecret: '54c6a7bd-7c0e-47f4-a5bd-55d4df515223',
      callbackURL: 'http://localhost:3000/auth/callback',
    },
  },
  ...devServer,
};
