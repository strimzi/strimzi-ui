/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import express from 'express';
import helmet from 'helmet';
import { randomBytes } from 'crypto';
import * as availableModules from './modules';
import { serverConfig, UIServerModule } from 'types';
import { generateLoggers, log, authFunction } from 'placeholder';

export const returnExpress: (
  serverName: string,
  getConfig: () => serverConfig
) => express.Application = (serverName, getConfig) => {
  const app = express();

  // add helmet middleware
  app.use(helmet());

  // for each module, call the function to add it to the routing table
  const routingTable = Object.values(availableModules).reduce(
    (
      acc: Record<
        string,
        { mountPoint: string; routerForModule: express.Router }
      >,
      { moduleName, addModule }: UIServerModule
    ) => {
      log(
        serverName,
        'startup',
        'core',
        'moduleMount',
        `Mounting module '${moduleName}'`
      );
      const { mountPoint, routerForModule } = addModule(
        (moduleName) => generateLoggers(serverName, moduleName, 'startup'),
        authFunction(),
        getConfig()
      );
      log(
        serverName,
        'startup',
        'core',
        'moduleMount',
        `Mounted module '${moduleName}' on '${mountPoint}'`
      );
      return { ...acc, [moduleName]: { mountPoint, routerForModule } };
    },
    {}
  );

  // before all handlers, add context and request start/end handlers
  app.all('*', (req, res, next) => {
    // add id to request for use downstream
    if (!req.headers.surid) {
      req.headers.surid = randomBytes(8).toString('hex');
    }
    const requestID = req.headers.surid as string;
    // create a 'context' for this request, containing config, a request ID, and loggers. Available to handlers via `res.locals.strimziuicontext`
    res.locals.strimziuicontext = {
      config: getConfig(),
      requestID,
    };
    // set up loggers for start/end of request
    const { event } = generateLoggers(serverName, 'core', requestID);
    event(`requestStart`, `${req.method} of ${req.url} starting`);
    res.once('finish', () => {
      event(
        `requestEnd`,
        `${req.method} of ${req.url} complete RC: ${res.statusCode}`
      );
    });
    next();
  });

  Object.entries(routingTable).forEach(
    ([moduleName, { mountPoint, routerForModule }]) =>
      app.all(`${mountPoint}*`, (req, res, next) => {
        // add loggers for this module
        res.locals.strimziuicontext = {
          ...res.locals.strimziuicontext,
          loggers: generateLoggers(
            serverName,
            moduleName,
            res.locals.strimziuicontext.requestID
          ),
        };

        const { entry } = res.locals.strimziuicontext.loggers;
        const { debug, exit } = entry(`module enabled check`);
        const isEnabled =
          res.locals.strimziuicontext.config.modules[moduleName];
        debug(`Enabled?`, isEnabled);
        exit(isEnabled);
        isEnabled ? routerForModule(req, res, next) : next(); // if enabled, call the router for the module so it can handle the request. Else, call the next module
      })
  );

  return app;
};
