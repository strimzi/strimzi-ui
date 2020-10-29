/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import pinoLogger from 'pino';
import pinoHttpLogger from 'pino-http';
import { randomBytes } from 'crypto';

import { getServerName } from 'serverConfig';
import { entryExitLoggerType } from 'types';

const STRIMZI_UI_REQUEST_ID_HEADER = 'x-strimzi-ui-request';

const serverName = getServerName();

let rootLogger = pinoLogger();

/** Replaces the rootLogger with a new pinoLogger with the supplied options */
const updateRootLoggerOptions: (
  loggerOptions: pinoLogger.LoggerOptions,
  isUpdate: boolean
) => void = (loggerOptions, isUpdate) => {
  rootLogger.info(
    {
      serverName,
      module: 'logging',
      loggerOptions,
    },
    `Strimzi ui logging options${isUpdate ? ' updated' : ''}`
  );
  try {
    // Update the root logger with the new options
    rootLogger = pinoLogger(loggerOptions);
  } catch (err) {
    rootLogger.error(
      {
        serverName,
        module: 'logging',
        loggerOptions,
        err,
      },
      `Failed to configure logging options: ${err.message}`
    );
  }
};

/** Generate an entryExitLogger */
const generateLogger: (
  module: string,
  requestID?: string
) => entryExitLoggerType = (module, requestID) => {
  const logger = rootLogger.child({
    serverName,
    module,
    requestID,
  });

  const entryExitLogger = logger;
  entryExitLogger.entry = (fnName, ...params) => {
    logger.trace({ fnName, params }, 'entry');
    return {
      exit: (returns) => {
        logger.trace({ fnName, returns }, 'exit');
        return returns; // return params so you can do `return exit(.....)`
      },
    };
  };

  return entryExitLogger as entryExitLoggerType;
};

/** Generate a pino-http HttpLogger */
const generateHttpLogger: () => pinoHttpLogger.HttpLogger = () =>
  pinoHttpLogger({
    logger: rootLogger,
    useLevel: 'debug',
    genReqId: generateRequestID,
    reqCustomProps: () => ({
      serverName,
      module: 'core',
    }),
  });

/** Generate or retrieve the request ID used in the pino-http HttpLogger */
const generateRequestID: (Request) => string = (req) => {
  if (!req.headers[STRIMZI_UI_REQUEST_ID_HEADER]) {
    req.headers[STRIMZI_UI_REQUEST_ID_HEADER] = randomBytes(8).toString('hex');
  }
  return req.headers[STRIMZI_UI_REQUEST_ID_HEADER] as string;
};

export {
  generateLogger,
  generateHttpLogger,
  updateRootLoggerOptions,
  STRIMZI_UI_REQUEST_ID_HEADER,
};
