/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import { existsSync, watch } from 'fs';
import { resolve } from 'path';
import merge from 'lodash.merge';
import { server } from 'ui-config/index';

const { defaultConfig, serverConfigPath, serverName } = server.values;

import { serverConfigType, loggerType } from 'types';

/** Out of the box when built by webpack, it replaces `require` with it's own version (`__webpack_require__`), which requires static paths. As we use require to load a config from an envvar, we need the node require function (`__non_webpack_require__`, as called by webpack). Thus, check if we are in a webpack built environment (I.e `__non_webpack_require__` is defined), and if so, use it, else use `require` (which will be the normal node require, used via ts-node etc) */
/* eslint-disable no-undef */
const requireForConfigLoad =
  typeof __non_webpack_require__ !== 'undefined' && __non_webpack_require__
    ? __non_webpack_require__
    : require;
/* eslint-enable no-undef */

const defaultServerConfig = (defaultConfig as unknown) as serverConfigType;

export const getDefaultConfig: () => serverConfigType = () =>
  merge({}, defaultServerConfig);

const pathToConfigFile = resolve(serverConfigPath as string);

const configFileExists = existsSync(pathToConfigFile);
export const getServerName: () => string = () => serverName as string;

export const loadConfig: (
  callback: (config: serverConfigType) => void,
  logger: loggerType
) => void = (callback, logger) => {
  let config = merge({}, defaultServerConfig);

  if (configFileExists) {
    logger.info(`Using config file '${pathToConfigFile}'`);

    delete requireForConfigLoad.cache[
      requireForConfigLoad.resolve(pathToConfigFile)
    ];
    // this is a deliberate require so we can load json/js, and have it parsed/modules evaluated
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
  callbackOnConfigChange: (newConfig: serverConfigType) => void,
  logger: loggerType
) => void = (callbackOnConfigChange, logger) =>
  configFileExists &&
  watch(
    pathToConfigFile,
    undefined,
    (evt) => evt === 'change' && loadConfig(callbackOnConfigChange, logger)
  );
