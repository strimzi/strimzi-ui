/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import express from 'express';
import { UIServerModule } from 'types';

const moduleName = 'log';

export const LogModule: UIServerModule = {
  moduleName,
  addModule: (logGenerator, authFn) => {
    const logger = logGenerator(moduleName);
    const { exit } = logger.entry('addModule');
    const routerForModule = express.Router();

    // implementation to follow
    routerForModule.get('*', authFn, (req, res) => res.sendStatus(200));

    return exit({ mountPoint: '/log', routerForModule });
  },
};
