/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import { existsSync, readFile, watch } from 'fs';
import { resolve } from 'path';
import merge from 'lodash.merge';

import { log } from 'placeholder';
import { serverConfig, supportedAuthenticationStrategyTypes } from 'types';

const defaultConfig: serverConfig = {
  authentication: {
    strategy: 'none' as supportedAuthenticationStrategyTypes,
  },
  client: {
    transport: {},
  },
  configurationOverrides: {},
  featureFlags: {},
  modules: {
    api: true,
    client: true,
    config: true,
    log: true,
    mockapi: false,
  },
  proxy: {
    hostname: '0.0.0.0',
    port: 3000,
    transport: {},
  },
  logging: true,
  hostname: '0.0.0.0',
  port: 3000,
};

const pathToConfigFile = process.env.configPath
  ? resolve(process.env.configPath)
  : resolve('./server.config.json'); // default file config

const configFileExists = existsSync(pathToConfigFile);

export const getServerName: () => string = () =>
  process.env.serverName || 'Strimzi-ui server';

export const loadConfig: (
  callback: (config: serverConfig, err?: Error | null) => void
) => void = (callback) =>
  readFile(pathToConfigFile, { encoding: 'utf-8' }, (err, fileContent) => {
    let config = merge({}, defaultConfig);
    if (err) {
      log(
        getServerName(),
        'runtime',
        'config',
        'Error',
        `Error thrown while reading config file: ${err.message}`,
        err
      );
      log(
        getServerName(),
        'runtime',
        'config',
        'Error',
        `Will fallback to default config`
      );
    } else {
      log(
        getServerName(),
        'runtime',
        'config',
        'loadConfig',
        `Loaded configuration from: ${pathToConfigFile}`
      );
      const parsedConfig = JSON.parse(fileContent);
      // merge parsed with core/std config
      config = merge(config, parsedConfig);
    }
    callback(config, err);
  });

export const watchConfig: (
  callbackOnConfigChange: (newConfig: serverConfig, err?: Error | null) => void
) => void = (callbackOnConfigChange) =>
  configFileExists &&
  watch(
    pathToConfigFile,
    undefined,
    (evt) => evt === 'change' && loadConfig(callbackOnConfigChange)
  );
