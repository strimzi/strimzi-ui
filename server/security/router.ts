/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import express from 'express';
import { authenticationStrategies, UIServerModule } from '../types';
import { apiRoot, scram, oauth, common } from './routeConfig';

const moduleName = 'security';

export const SecurityModule: UIServerModule = {
  moduleName,
  addModule: (logger, auth, { proxy }) => {
    const authentication = proxy.authentication;
    const { exit } = logger.entry('addModule', authentication);
    const routerForModule = express.Router();

    switch (authentication.type) {
      case authenticationStrategies.SCRAM: {
        logger.info('Mouting SCRAM security routes');
        routerForModule.post(scram.login, auth.authenticate, (_req, res) =>
          res.send(200)
        );
        routerForModule.get(
          scram.login,
          (_req, res) => res.send('This will later be the login page') //https://github.com/strimzi/strimzi-ui/issues/110
        );
        routerForModule.post(common.logout, auth.logout, (_req, res) =>
          res.send(200)
        );
        break;
      }
      case authenticationStrategies.OAUTH: {
        logger.info('Mouting OAUTH security routes');
        routerForModule.get(oauth.callback, auth.authenticate, (req, res) => {
          const url = req.session.originalURL;
          req.session.originalURL = '/';
          return res.redirect(url || '/');
        });
        routerForModule.get(common.logout, auth.logout);
        break;
      }
      case authenticationStrategies.NONE: {
        //noop
        break;
      }
    }

    return exit({ mountPoint: apiRoot, routerForModule });
  },
};
