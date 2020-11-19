/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import express from 'express';
import { UIServerModule } from 'types';

import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';
import { apolloConfig } from './controller';

const moduleName = 'config';

export const ConfigModule: UIServerModule = {
  moduleName,
  addModule: (logger, authFn, config) => {
    const { exit } = logger.entry('addModule');
    const routerForModule = express.Router();

    const server = new ApolloServer({
      ...apolloConfig(config),
    });

    routerForModule.use(
      authFn,
      bodyParser.json(),
      server.getMiddleware({ path: '/' })
    );

    return exit({ mountPoint: '/config', routerForModule });
  },
};
