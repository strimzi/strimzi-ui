/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const { existsSync, readFileSync } = require('fs');
const { resolve } = require('path');

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
};
