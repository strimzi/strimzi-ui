/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import http from 'http';
import https from 'https';

import { loadConfig, watchConfig, getServerName } from 'serverConfig';
import { returnExpress } from 'core';
import { log } from 'placeholderFunctionsToReplace';

const errorHandler: (err: Error, ...others: unknown[]) => void = (
  err,
  ...others
) => {
  log(
    serverName,
    'runtime',
    'main',
    'Error',
    `Error thrown: ${err.message}`,
    err,
    others
  );
  // trace the error to syserr, but dont kill the process
  // eslint-disable-next-line no-console
  console.trace();
};

const serverName = getServerName();

log(
  serverName,
  'startup',
  'main',
  'server starting',
  `Strimzi ui server initialising`
);

loadConfig((loadedInitialConfig) => {
  let config = loadedInitialConfig;

  log(
    serverName,
    'startup',
    'main',
    'server starting',
    `Strimzi ui server starting with config`,
    JSON.stringify(config)
  );

  watchConfig((latestConfig) => {
    log(
      serverName,
      'runtime',
      'main',
      'configReload',
      `Strimzi ui server configuration changing to for future requests:`,
      JSON.stringify(latestConfig)
    );
    config = latestConfig;
  }); // load config and update config value

  const expressAppForServer = returnExpress(serverName, () => config);

  const { cert, key, ciphers, minTLS } = config.client.transport;
  let server;
  let isServerSecure = false;

  if (cert && key) {
    isServerSecure = true;
    log(
      serverName,
      'startup',
      'main',
      'server starting',
      `Strimzi ui server will server via HTTPS`
    );
    const httpsConfig = {
      key,
      cert,
      ciphers,
      minVersion: minTLS || 'TLSv1.2',
    };
    server = https.createServer(httpsConfig, expressAppForServer);
  } else {
    log(
      serverName,
      'startup',
      'main',
      'server starting',
      `Strimzi ui server will server via HTTP`
    );
    server = http.createServer(expressAppForServer);
  }

  const instance = server.listen(config.port, config.hostname, () =>
    log(
      serverName,
      'startup',
      'main',
      'server ready',
      `Strimzi ui server ready at http${isServerSecure ? 's' : ''}://${
        config.hostname
      }:${config.port}`
    )
  );

  const shutdown = (server) => () =>
    server.close(() => {
      log(
        serverName,
        'teardown',
        'main',
        'server closing',
        `Strimzi ui server closed`
      );
      process.exit(0);
    });

  process.on('SIGTERM', shutdown(instance));
  process.on('SIGINT', shutdown(instance));
});

// catch errors gracefully
process.on('uncaughtException', errorHandler);
process.on('unhandledRejection', errorHandler);
