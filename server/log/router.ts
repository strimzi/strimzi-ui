/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import express from 'express';
import { Logger } from 'pino';
import { Data } from 'ws';
import {
  ClientLoggingEvent,
  strimziUIRequestType,
  strimziUIResponseType,
  UIServerModule,
} from 'types';

const moduleName = 'log';

export const LogModule: UIServerModule = {
  moduleName,
  addModule: (logger, authFn) => {
    const { exit } = logger.entry('addModule');
    const routerForModule = express.Router();

    // implementation to follow
    routerForModule.get('*', authFn, (req, res) => {
      const { isWs } = req as strimziUIRequestType;
      const { ws } = res as strimziUIResponseType;
      if (isWs) {
        ws.on('message', messageHandler(logger));
        ws.on('close', closeHandler(logger));
      } else {
        // Return 426 Upgrade Required if this isn't a websocket request
        res.sendStatus(426);
      }
    });

    return exit({ mountPoint: '/log', routerForModule });
  },
};

const messageHandler: (logger: Logger) => (data: Data) => void = (logger) => (
  data
) => {
  if (typeof data === 'string') {
    try {
      JSON.parse(data).forEach((clientLogEvent: ClientLoggingEvent) => {
        if (clientLogEvent.clientLevel) {
          logger[clientLogEvent.clientLevel](clientLogEvent);
        } else {
          logger.debug(clientLogEvent);
        }
      });
    } catch (err) {
      // Ignore any data that cannot be parsed
      logger.trace({ err }, `messageHandler failed: ${err.message}, ${data}`);
    }
  } else {
    // Ignore any non-string data
    logger.trace(
      `messageHandler ignoring data of type ${typeof data}: ${data}`
    );
  }
};

const closeHandler: (
  logger: Logger
) => (code: number, reason: string) => void = (logger) => (code, reason) =>
  logger.debug(`WebSocket listener closed. (${code}) ${reason}`);
