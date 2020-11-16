/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import { Config, Literal } from './types';
import { version as strimziUiVersion } from '../package.json';

/**
 * static configuration - literal values for the client and server that can be defined at develop time
 */

const client: Config<Literal> = {
  about: {
    version: strimziUiVersion,
  },
};

const server: Config<Literal> = {
  defaultConfig: {
    configValue: {
      authentication: {
        strategy: 'none',
      },
      client: {
        configOverrides: {},
        transport: {},
        publicDir: './dist/client',
      },
      featureFlags: {},
      modules: {
        api: true,
        client: true,
        config: true,
        log: true,
        mockapi: false,
      },
      proxy: {
        hostname: 'strimzi.admin.hostname.com',
        contextRoot: '/',
        port: 9080,
        transport: {},
      },
      session: {
        name: 'strimzi-ui',
      },
      logging: {},
      hostname: '0.0.0.0',
      port: 3000,
    },
  },
};

export { client, server };
