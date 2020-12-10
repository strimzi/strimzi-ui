/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import express from 'express';
import helmet from 'helmet';
import * as availableModules from './modules';
import { serverConfigType, UIServerModule } from 'types';
import expressSession, { SessionOptions } from 'express-session';
import bodyParser from 'body-parser';
import {
  generateLogger,
  generateHttpLogger,
  STRIMZI_UI_REQUEST_ID_HEADER,
} from 'logging';
import { bootstrapAuthentication } from 'security';

export const returnExpress: (
  getConfig: () => serverConfigType
) => express.Application = (getConfig) => {
  const logger = generateLogger('core');
  const app = express();

  const { session: sessionConfig, proxy: proxyConfig } = getConfig();

  // add helmet middleware
  app.use(helmet());

  // add pino-http middleware
  app.use(generateHttpLogger());

  //Add session middleware
  const sessionOpts: SessionOptions = {
    secret: 'CHANGEME', //TODO replace with value from config https://github.com/strimzi/strimzi-ui/issues/111
    name: sessionConfig.name,
    cookie: {
      maxAge: 1000 * 3600 * 24 * 30, //30 days as a starting point //TODO replace with value from config https://github.com/strimzi/strimzi-ui/issues/111
    },
  };
  app.use(expressSession(sessionOpts));
  app.use(bodyParser.json());

  const authentication = bootstrapAuthentication(app, proxyConfig);

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
        generateLogger(moduleName),
        authentication,
        config
      );
      logger.info(`Mounted module '${moduleName}' on '${mountPoint}'`);
      return { ...acc, [moduleName]: { mountPoint, routerForModule } };
    },
    {}
  );

  // before all handlers, add context and request start/end handlers
  app.all('*', (req, res, next) => {
    // log start of request (end of request is automatically logged)
    req.log.debug('Request received');
    // make sure the response has the requestID header (set via the pino-http middleware)
    res.setHeader(STRIMZI_UI_REQUEST_ID_HEADER, req.id as string);

    // create a 'context' for this request, containing config and the request ID. Available to handlers via `res.locals.strimziuicontext`
    res.locals.strimziuicontext = {
      config: getConfig(),
      requestID: req.id,
    };
    next();
  });

  Object.entries(routingTable)
    .map(([moduleName, { mountPoint, routerForModule }]) => ({
      moduleName,
      mountPoint,
      routerForModule,
    }))
    .sort(({ mountPoint: mountPointA }, { mountPoint: mountPointB }) => {
      // Sort mountpoints in reverse order, so that the shortest mountpoints are added last
      // and do not route traffic meant for other endpoints
      return mountPointA < mountPointB ? 1 : mountPointA > mountPointB ? -1 : 0;
    })
    .forEach(({ moduleName, mountPoint, routerForModule }) => {
      logger.debug(
        `Setting up app.use('${mountPoint}') for module '${moduleName}'`
      );
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
      });
    });

  return app;
};
