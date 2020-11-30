/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { resolve } from 'path';
import { serverConfigType } from 'types';
import { getDefaultConfig } from 'serverConfig';
import merge from 'lodash.merge';

const defaultConfig: () => serverConfigType = () => getDefaultConfig();

const defaultTestConfig: () => serverConfigType = () =>
  merge(defaultConfig(), { logging: {} });

const modules = {
  api: false,
  client: false,
  config: false,
  log: false,
  mockapi: false,
};

const mockapiModuleConfig: () => serverConfigType = () =>
  merge({}, defaultTestConfig(), {
    modules: { ...modules, mockapi: true },
  });

const logModuleConfig: () => serverConfigType = () =>
  merge({}, defaultTestConfig(), {
    modules: { ...modules, log: true },
  });

const configModuleConfig: () => serverConfigType = () =>
  merge({}, defaultTestConfig(), {
    modules: { ...modules, config: true },
  });

const configModuleWithConfigOverrides: () => serverConfigType = () =>
  merge({}, configModuleConfig(), {
    client: {
      configOverrides: {
        version: '34.0.0',
      },
    },
    featureFlags: {
      client: {
        Home: {
          showVersion: false,
        },
      },
      testFlag: true,
    },
  });

const clientModuleConfig: () => serverConfigType = () =>
  merge({}, defaultTestConfig(), {
    client: {
      publicDir: resolve(__dirname, './__test_fixtures__/client'),
    },
    modules: { ...modules, client: true },
  });

const apiModuleConfig: () => serverConfigType = () =>
  merge({}, defaultTestConfig(), {
    proxy: {
      hostname: 'test-backend',
      port: 3434,
    },
    modules: { ...modules, api: true },
  });

const apiModuleConfigWithCustomContextRoot: () => serverConfigType = () =>
  merge({}, defaultTestConfig(), {
    proxy: {
      hostname: 'test-backend',
      port: 3434,
      contextRoot: '/myCustomContextRoot',
    },
    modules: { ...modules, api: true },
  });

const securedApiModuleConfig: () => serverConfigType = () =>
  merge(apiModuleConfig(), {
    proxy: {
      transport: {
        cert: 'mock certificate',
      },
    },
  });

export const getConfigForName: (name: string) => serverConfigType = (name) => {
  switch (name) {
  default:
  case 'default':
  case 'production':
    return defaultTestConfig();
  case 'mockapi_only':
    return mockapiModuleConfig();
  case 'log_only':
    return logModuleConfig();
  case 'config_only':
    return configModuleConfig();
  case 'config_only_with_config_overrides':
    return configModuleWithConfigOverrides();
  case 'client_only':
    return clientModuleConfig();
  case 'api_only':
    return apiModuleConfig();
  case 'api_secured_only':
    return securedApiModuleConfig();
  case 'api_with_custom_context_root':
    return apiModuleConfigWithCustomContextRoot();
  }
};
