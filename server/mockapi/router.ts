/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import express from 'express';
import { UIServerModule } from 'types';

const moduleName = 'mockapi';

export const MockApiModule: UIServerModule = {
  moduleName,
  addModule: (logGenerator) => {
    const { entry } = logGenerator(moduleName);
    const { exit } = entry('addModule');
    const routerForModule = express.Router();

    // implementation to follow
    routerForModule.get('*', (req, res) => res.sendStatus(200));

    return exit({ mountPoint: '/api', routerForModule });
  },
};
