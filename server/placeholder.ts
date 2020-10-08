/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
// placeholder functions - to be replaced by actual implementation later

import express from 'express';
import { createLogger } from 'types';

// https://github.com/orgs/strimzi/projects/2#card-44265081
// function which returns a piece of express middleware for a given auth strategy
const authFunction: () => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => void = () => (req, res, next) => next(); // if auth on, reject for sake of example. This is a middleware, akin to passport doing its checks.

//https://github.com/orgs/strimzi/projects/2#card-46109274
const log: (
  prefix: string,
  requestId: string,
  messageSource: string,
  handler: string,
  msg: string,
  ...params: unknown[]
) => void = (prefix, requestId, messageSource, handler, msg, ...params) =>
  console.log(
    `${prefix} : ${new Date()} ${requestId} - ${messageSource} - ${handler} - ${msg} ${params.reduce(
      (acc, param) => `- ${acc} ${param}`,
      ''
    )}`
  );

//https://github.com/orgs/strimzi/projects/2#card-46109274
const generateLoggers: createLogger = (prefix, moduleName, requestID) => ({
  entry: (fnName, ...params) => {
    log(prefix, requestID, moduleName, fnName, `entry`, ...params);
    return {
      exit: (params) => {
        log(prefix, requestID, moduleName, fnName, 'exit', params);
        return params; // return params so you could do return exit(.....)
      },
      debug: (msg, ...params) =>
        log(prefix, requestID, moduleName, fnName, `debug: ${msg}`, ...params), // entry logs and returns exit/debug functions
    };
  },
  event: (eventName, msg, ...params) =>
    log(prefix, requestID, moduleName, eventName, msg, ...params),
});

export { generateLoggers, log, authFunction };
