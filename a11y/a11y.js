/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

const loginStrimzi = async () => {
  return;
};
const waitForStrimzi = async () => {
  return;
};

module.exports = {
  prefix: process.env.STRIMZI_CLIENT_URL || 'http://localhost:8080',
  auth: loginStrimzi,
  waitFor: waitForStrimzi,
  crawl: false,
  urls: ['/'],
};
