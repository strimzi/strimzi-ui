/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import express from 'express';
import helmet from 'helmet';
import * as availableModules from './modules';
import { serverConfig, UIServerModule } from 'types';
import { authFunction } from 'placeholderFunctionsToReplace';
import {
  generateLogger,
  generateHttpLogger,
  STRIMZI_UI_REQUEST_ID_HEADER,
} from 'logging';

const logger = generateLogger('core');

export const returnExpress: (
  serverName: string,
  getConfig: () => serverConfig
) => express.Application = (serverName, getConfig) => {
  const app = express();
  const httpLogger = generateHttpLogger();

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
      logger.info(`Mounting module '${moduleName}'`);
      const config = getConfig();
      const { mountPoint, routerForModule } = addModule(
        (moduleName) => generateLogger(moduleName),
        authFunction(config.authentication),
        config
      );
      logger.info(`Mounted module '${moduleName}' on '${mountPoint}'`);
      return { ...acc, [moduleName]: { mountPoint, routerForModule } };
    },
    {}
  );

  // before all handlers, add context and request start/end handlers
  app.all('*', (req, res, next) => {
    // set up logger for start/end of request
    httpLogger(req, res);
    req.log.debug('Request received');
    // and make sure the response has the requestID header
    res.setHeader(STRIMZI_UI_REQUEST_ID_HEADER, req.id as string);

    // create a 'context' for this request, containing config and the request ID. Available to handlers via `res.locals.strimziuicontext`
    res.locals.strimziuicontext = {
      config: getConfig(),
      requestID: req.id,
    };
    next();
  });

  Object.entries(routingTable).forEach(
    ([moduleName, { mountPoint, routerForModule }]) =>
      app.use(`${mountPoint}`, (req, res, next) => {
        // add logger for this module
        res.locals.strimziuicontext = {
          ...res.locals.strimziuicontext,
          logger: generateLogger(moduleName, req.id as string),
        };

        const isEnabled =
          res.locals.strimziuicontext.config.modules[moduleName];
        res.locals.strimziuicontext.logger.debug(
          `%s module is ${isEnabled ? '' : 'not '}enabled`,
          moduleName
        );
        isEnabled ? routerForModule(req, res, next) : next(); // if enabled, call the router for the module so it can handle the request. Else, call the next module
      })
  );

  return app;
};
