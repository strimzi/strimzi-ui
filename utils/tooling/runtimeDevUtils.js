/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const { existsSync, readFileSync } = require('fs');
const { resolve } = require('path');

// development time environment variable overrides.
const devEnvValues = {
  // webpack dev server hostname and port
  webpackDevServer: {
    hostname: process.env.WDS_HOSTNAME || 'localhost',
    port: process.env.WDS_PORT || 8080,
  },
  // mock admin server hostname, port and api module context root
  mockadminServer: {
    hostname: process.env.MA_HOSTNAME || 'localhost',
    port: process.env.MA_PORT || 9080,
    contextRoot: process.env.MA_CONTEXT_ROOT || '/api',
  },
  // (development instance) server hostname and port
  devServer: {
    hostname: process.env.SD_HOSTNAME || 'localhost',
    port: process.env.SD_PORT || 3000,
  },
};

const getIfExists = (file) =>
  existsSync(resolve(__dirname, file))
    ? readFileSync(resolve(__dirname, file))
    : undefined;

const serverCertificates = {
  cert: getIfExists('../../generated/dev_certs/strimzi-ui-server.cert'),
  key: getIfExists('../../generated/dev_certs/strimzi-ui-server.key'),
};

const mockAdminCertificates = {
  cert: getIfExists('../../generated/dev_certs/strimzi-ui-mock-admin.cert'),
  key: getIfExists('../../generated/dev_certs/strimzi-ui-mock-admin.key'),
};

module.exports = {
  devEnvToUseTls:
    serverCertificates.cert && serverCertificates.key ? true : false,
  serverCertificates,
  mockAdminCertificates,
  devEnvValues,
};
