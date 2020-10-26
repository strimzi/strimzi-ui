/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { resolve } from 'path';
import { serverConfig } from 'types';
import { getDefaultConfig } from 'serverConfig';
import merge from 'lodash.merge';

const defaultConfig: () => serverConfig = () => getDefaultConfig();

const defaultTestConfig: () => serverConfig = () =>
  merge(defaultConfig(), { logging: false });

const modules = {
  api: false,
  client: false,
  config: false,
  log: false,
  mockapi: false,
};

const mockapiModuleConfig: () => serverConfig = () =>
  merge(merge({}, defaultTestConfig()), {
    modules: { ...modules, mockapi: true },
  });
const logModuleConfig: () => serverConfig = () =>
  merge(merge({}, defaultTestConfig()), {
    modules: { ...modules, log: true },
  });
const configModuleConfig: () => serverConfig = () =>
  merge(merge({}, defaultTestConfig()), {
    modules: { ...modules, config: true },
  });
const clientModuleConfig: () => serverConfig = () =>
  merge(merge({}, defaultTestConfig()), {
    client: {
      configOverrides: {
        publicDir: resolve(__dirname, './__test_fixtures__/client'),
      },
    },
    modules: { ...modules, client: true },
  });

const apiModuleConfig: () => serverConfig = () =>
  merge(merge({}, defaultTestConfig()), {
    proxy: {
      hostname: 'test-backend',
      port: 3434,
    },
    modules: { ...modules, api: true },
  });

const apiModuleConfigWithCustomContextRoot: () => serverConfig = () =>
  merge(merge({}, defaultTestConfig()), {
    proxy: {
      hostname: 'test-backend',
      port: 3434,
      contextRoot: '/myCustomContextRoot',
    },
    modules: { ...modules, api: true },
  });

const securedApiModuleConfig: () => serverConfig = () =>
  merge(merge(apiModuleConfig()), {
    proxy: {
      transport: {
        cert: 'mock certificate',
      },
    },
  });

export const getConfigForName: (name: string) => serverConfig = (name) => {
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
