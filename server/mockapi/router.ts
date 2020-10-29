/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import express from 'express';
import { UIServerModule } from 'types';

const moduleName = 'mockapi';

export const MockApiModule: UIServerModule = {
  moduleName,
  addModule: (logger) => {
    const { exit } = logger.entry('addModule');
    const routerForModule = express.Router();

    // endpoint used for test purposes
    routerForModule.get('/test', (_, res) => {
      const { entry } = res.locals.strimziuicontext.logger;
      const { exit } = entry('`/test` handler');
      res.setHeader('x-strimzi-ui-module', moduleName);
      res.sendStatus(418);
      exit(418);
    });

    // other implementation to follow
    routerForModule.get('/*', (req, res) => res.sendStatus(200));

    return exit({ mountPoint: '/api', routerForModule });
  },
};
