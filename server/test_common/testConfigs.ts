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
  security: false,
};

const singleModule: (module: string) => serverConfigType = (module) =>
  merge({}, defaultTestConfig(), {
    modules: { ...modules, ...{ [module]: true } },
  });

const clientModuleConfig: () => serverConfigType = () =>
  merge(singleModule('client'), {
    client: {
      publicDir: resolve(__dirname, './__test_fixtures__/client'),
    },
  });

const configModuleWithConfigOverrides: () => serverConfigType = () =>
  merge(singleModule('config'), {
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

const apiModuleConfig: () => serverConfigType = () =>
  merge(singleModule('api'), {
    proxy: {
      hostname: 'test-backend',
      port: 3434,
    },
  });

const apiModuleConfigWithCustomContextRoot: () => serverConfigType = () =>
  merge(singleModule('api'), {
    proxy: {
      hostname: 'test-backend',
      port: 3434,
      contextRoot: '/myCustomContextRoot',
    },
  });

const securedApiModuleConfig: () => serverConfigType = () =>
  merge(singleModule('api'), {
    proxy: {
      transport: {
        cert: 'mock certificate',
      },
    },
  });

export const enableModule: (
  module: string,
  config: serverConfigType
) => serverConfigType = (module, config) =>
  merge({}, config, {
    modules: { [module]: true },
  });

export const getConfigForName: (name: string) => serverConfigType = (name) => {
  switch (name) {
    case 'default':
    case 'production':
      return defaultTestConfig();
    case 'config_with_overrides':
      return configModuleWithConfigOverrides();
    case 'client':
      return clientModuleConfig();
    case 'api':
      return apiModuleConfig();
    case 'api_secured':
      return securedApiModuleConfig();
    case 'api_with_custom_context_root':
      return apiModuleConfigWithCustomContextRoot();
    default:
      return singleModule(name);
  }
};
