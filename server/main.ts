/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import http from 'http';
import https from 'https';
import WebSocket from 'ws';

import { loadConfig, watchConfig } from 'serverConfig';
import { returnExpress } from 'core';
import { generateLogger, updateRootLoggerOptions } from 'logging';
import { strimziUIResponseType } from 'types';

let logger = generateLogger('main');
const errorHandler: (err: Error, ...others: unknown[]) => void = (
  err,
  ...others
) => {
  logger.error({ err, ...others }, `Error thrown: ${err.message}`);
};

logger.info('Strimzi ui server initialising');

loadConfig((loadedInitialConfig) => {
  let config = loadedInitialConfig;

  logger.info(
    { config }, // include the config in the log event JSON
    'Strimzi ui server starting with config'
  );
  updateRootLoggerOptions(config.logging, false);
  logger = generateLogger('main');

  watchConfig((latestConfig) => {
    config = latestConfig;
    logger.info(
      { config }, // include the updated config in the log event JSON
      'Strimzi ui server configuration update'
    );
    updateRootLoggerOptions(config.logging, true);
    logger = generateLogger('main');
  }, logger); // load config and update config value

  const expressApp = returnExpress(() => config);

  const { cert, key, ciphers, minTLS } = config.client.transport;
  let server;
  let isServerSecure = false;

  if (cert && key) {
    isServerSecure = true;
    logger.info('Strimzi ui server will serve via HTTPS');
    const httpsConfig = {
      key,
      cert,
      ciphers,
      minVersion: minTLS || 'TLSv1.2',
    };
    server = https.createServer(httpsConfig, expressApp);
  } else {
    logger.info('Strimzi ui server will serve via HTTP');
    server = http.createServer(expressApp);
  }

  const instance = server.listen(config.port, config.hostname, () =>
    logger.info(
      `Strimzi ui server ready at http${isServerSecure ? 's' : ''}://${
        config.hostname
      }:${config.port}`
    )
  );

  const wss = new WebSocket.Server({ noServer: true });
  instance.on('upgrade', (req, socket, head) => {
    const { upgrade, connection } = req.headers;
    logger.trace(
      { headers: { upgrade, connection } },
      `Upgrade request received for ${req.url}`
    );

    if (upgrade === 'websocket') {
      wss.handleUpgrade(req, socket, head, (ws) => {
        const res = new http.ServerResponse(req) as strimziUIResponseType;
        // add/mark the request as a websocket request
        req.isWs = true;
        res.ws = ws;
        // call the express app as usual
        expressApp(req, res);
      });
    }
  });

  const shutdown = (server) => () =>
    server.close(() => {
      logger.info('Strimzi ui server closed');
      process.exit(0);
    });

  process.on('SIGTERM', shutdown(instance));
  process.on('SIGINT', shutdown(instance));
}, logger);

// catch errors gracefully
process.on('uncaughtException', errorHandler);
process.on('unhandledRejection', errorHandler);
