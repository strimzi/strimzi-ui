/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { strimziUIRequestType, strimziUiResponseType } from 'types';

export const proxyErrorHandler: (
  err: Error,
  req: strimziUIRequestType,
  res: strimziUiResponseType
) => void = (err, req, res) => {
  const { entry } = res.locals.strimziuicontext.loggers;
  const { exit, debug } = entry('proxyErrorHandler', req.url, err.message);
  debug(`Error occurred during proxy`, err);
  exit(500);
  res.sendStatus(500);
};

export const proxyStartHandler: (
  proxyReq: unknown,
  req: strimziUIRequestType,
  res: strimziUiResponseType
) => void = (_, req, res) => {
  const { entry } = res.locals.strimziuicontext.loggers;
  const { exit } = entry('proxyStartHandler');
  exit(`Starting proxy of request '${req.url}' to the backend api`);
};

export const proxyCompleteHandler: (
  proxyRes: {
    statusCode: number;
    statusMessage: string;
  },
  req: strimziUIRequestType,
  res: strimziUiResponseType
) => void = ({ statusCode, statusMessage }, req, res) => {
  const { entry } = res.locals.strimziuicontext.loggers;
  const { exit } = entry('proxyCompleteHandler');
  exit(
    `Response from backend api for request '${req.url}' : ${statusCode} - ${statusMessage}`
  );
};
