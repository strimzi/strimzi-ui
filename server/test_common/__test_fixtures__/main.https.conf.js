/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import * as config from './main.http.conf';

import { serverCertificates } from '../../../utils/tooling/runtimeDevUtils.js';

module.exports = {
  ...config,
  client: {
    transport: {
      ...serverCertificates,
    },
  },
};
