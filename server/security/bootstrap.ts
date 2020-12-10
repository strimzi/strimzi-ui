/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { getStrategy } from './strategy/strategyFactory';
import passport from 'passport';
import { RequestHandler } from 'express';
import { proxyConfigType, authenticationStrategies } from 'types';
import { Application } from 'express';
import { Authentication } from './types';
import { apiRoot, scram } from './routeConfig';
import { join } from 'path';

const noOp: RequestHandler = (_req, _res, next) => next();
const noAuth = {
  authenticate: noOp,
  checkAuth: noOp,
  logout: noOp,
};

export const bootstrapPassport = (
  app: Application,
  config: proxyConfigType
): Authentication => {
  const authenticationConfig = config.authentication;

  if (authenticationConfig.type === authenticationStrategies.NONE) {
    return noAuth;
  }

  app.use(passport.initialize());
  app.use(passport.session());

  const authStrategy = getStrategy(config);

  passport.use(authStrategy.name, authStrategy.strategy);

  switch (authenticationConfig.type) {
    case authenticationStrategies.SCRAM: {
      passport.serializeUser((user, done) => done(null, user));
      passport.deserializeUser((user, done) => done(null, user));
      return {
        authenticate: passport.authenticate(authStrategy.name),
        checkAuth: (req, res, next) => {
          return req.isAuthenticated()
            ? next()
            : res.redirect(join(apiRoot, scram.login));
        },
        logout: (req, _res, next) => {
          req.logout();
          next();
        },
      };
    }
    default:
      throw new Error(`Unsupported type "${authenticationConfig.type}"`);
  }
};
