/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { Config, Literal } from './config.types';
import { getEnvvarValue } from './configHelpers';

/**
 * runtime configuration - values which can only be defined/evaluated at server runtime
 */

const client: Config<Literal> = {};

const server: Config<Literal> = {
  serverConfigPath: {
    configValue: getEnvvarValue('configPath', './server.config.json'),
  },
  serverName: {
    configValue: getEnvvarValue('serverName', 'Strimzi-ui server'),
  },
};

export { client, server };
