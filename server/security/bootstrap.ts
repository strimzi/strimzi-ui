/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { getStrategy } from './strategy/strategyFactory';
import passport from 'passport';
import { RequestHandler } from 'express';
import { proxyConfigType, authenticationStrategies, OAuthConfig } from 'types';
import { Application, Request } from 'express';
import {
  Authentication,
  OAuthEndpoints,
  AuthOptions,
  OAuthOptions,
} from './types';
import axios from 'axios';
import { generateLogger } from 'logging';
import url from 'url';
import { apiRoot, scram } from './routeConfig';
import path from 'path';

const logger = generateLogger('bootstrap');

const noOp: RequestHandler = (_req, _res, next) => next();
const noAuth = {
  authenticate: noOp,
  checkAuth: noOp,
  logout: noOp,
};

const generateEndpoint = (proxyConfig: proxyConfigType) => {
  const { exit } = logger.entry('generateEndpoint');
  return exit(
    `http://${proxyConfig.hostname}:${proxyConfig.port}${proxyConfig.contextRoot}`
  );
};

const generateRedirectURL = (req: Request): string => {
  const {
    protocol,
    hostname,
    connection: { localPort },
    path,
  } = req;

  return url.format({
    protocol,
    hostname,
    port: localPort,
    pathname: path,
  });
};

const discoverConfiguration = async (
  discoveryURL: string
): Promise<OAuthEndpoints> => {
  const { exit } = logger.entry('discoverConfiguration');
  const res = await axios.get(discoveryURL);
  const {
    issuer,
    authorization_endpoint,
    token_endpoint,
    userinfo_endpoint,
    end_session_endpoint,
  } = res.data;

  const config = {
    issuer,
    authorizationURL: authorization_endpoint,
    tokenURL: token_endpoint,
    userInfoURL: userinfo_endpoint,
    logoutURL: end_session_endpoint,
  };
  return exit(config);
};

export const bootstrapPassport = async (
  app: Application,
  proxy: proxyConfigType
): Promise<Authentication> => {
  const authenticationConfig = proxy.authentication;
  if (authenticationConfig.type === authenticationStrategies.NONE) {
    return noAuth;
  }

  const config: AuthOptions = await (async (type) => {
    switch (type) {
      case authenticationStrategies.SCRAM: {
        return {
          type,
          endpoint: generateEndpoint(proxy),
        };
      }
      case authenticationStrategies.OAUTH: {
        const oauth = authenticationConfig as OAuthConfig;
        const { clientID, clientSecret, callbackURL } = oauth;
        if (!oauth.discoveryURL) {
          throw new Error(
            'OAUTH configuration is missing discovery url property'
          );
        }
        const endpoints = await discoverConfiguration(oauth.discoveryURL);
        return {
          type,
          options: {
            ...endpoints,
            clientID,
            clientSecret,
            callbackURL,
          },
        };
      }
      default:
        throw new Error(`Unsupported type "${authenticationConfig.type}"`);
    }
  })(authenticationConfig.type);

  app.use(passport.initialize());
  app.use(passport.session());

  const authStrategy = getStrategy(config);

  passport.use(authStrategy.name, authStrategy.strategy);
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  switch (authenticationConfig.type) {
    case authenticationStrategies.SCRAM: {
      return {
        checkAuth: (req, res, next) =>
          req.isAuthenticated()
            ? next()
            : res.redirect(path.join(apiRoot, scram.login)),
        authenticate: passport.authenticate(authStrategy.name),
        logout: (req, res) => {
          req.logOut();
          return res.send(200);
        },
      };
    }
    case authenticationStrategies.OAUTH: {
      const oauthConfig = config as OAuthOptions;
      const logoutUrl = new URL(oauthConfig.options.logoutURL);
      return {
        checkAuth: (req, res, next) => {
          req.session.originalURL = generateRedirectURL(req);
          req.isAuthenticated()
            ? next()
            : passport.authenticate(authStrategy.name)(req, res, next);
        },
        logout: (req, res) => {
          const redirect_url = generateRedirectURL(req);
          logoutUrl.search = new url.URLSearchParams({
            redirect_url,
          }).toString();
          res.redirect(logoutUrl.toString());
        },
        authenticate: passport.authenticate(authStrategy.name),
      };
    }
  }
};
