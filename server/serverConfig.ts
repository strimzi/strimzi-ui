/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import { existsSync, watch } from 'fs';
import { resolve } from 'path';
import merge from 'lodash.merge';

import {
  serverConfig,
  supportedAuthenticationStrategyTypes,
  loggerType,
} from 'types';

/** Out of the box when built by webpack, it replaces `require` with it's own version (`__webpack_require__`), which requires static paths. As we use require to load a config from an envvar, we need the node require function (`__non_webpack_require__`, as called by webpack). Thus, check if we are in a webpack built environment (I.e `__non_webpack_require__` is defined), and if so, use it, else use `require` (which will be the normal node require, used via ts-node etc) */
/* eslint-disable no-undef */
const requireForConfigLoad =
  typeof __non_webpack_require__ !== 'undefined' && __non_webpack_require__
    ? __non_webpack_require__
    : require;
/* eslint-enable no-undef */

const defaultConfig: serverConfig = {
  authentication: {
    strategy: 'none' as supportedAuthenticationStrategyTypes,
  },
  client: {
    configOverrides: {
      publicDir: './dist/client',
    },
    transport: {},
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
  logging: {},
  hostname: '0.0.0.0',
  port: 3000,
};

export const getDefaultConfig: () => serverConfig = () =>
  merge({}, defaultConfig);

const pathToConfigFile = process.env.configPath
  ? resolve(process.env.configPath)
  : resolve('./server.config.json'); // default file config

const configFileExists = existsSync(pathToConfigFile);
export const getServerName: () => string = () =>
  process.env.serverName || 'Strimzi-ui server';

export const loadConfig: (
  callback: (config: serverConfig) => void,
  logger: loggerType
) => void = (callback, logger) => {
  let config = merge({}, defaultConfig);

  if (configFileExists) {
    logger.info(`Using config file '${pathToConfigFile}'`);

    delete requireForConfigLoad.cache[
      requireForConfigLoad.resolve(pathToConfigFile)
    ];
    // this is a deliberate require so we can load json/js, and have it parsed/modules evaluated
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const loadedConfig = requireForConfigLoad(pathToConfigFile);
    // merge parsed with core/std config
    config = merge(config, loadedConfig);
  } else {
    logger.error(
      `The file specified config file '${pathToConfigFile}' was not found. Will fallback to default config`
    );
  }
  callback(config);
};

export const watchConfig: (
  callbackOnConfigChange: (newConfig: serverConfig) => void,
  logger: loggerType
) => void = (callbackOnConfigChange, logger) =>
  configFileExists &&
  watch(
    pathToConfigFile,
    undefined,
    (evt) => evt === 'change' && loadConfig(callbackOnConfigChange, logger)
  );
