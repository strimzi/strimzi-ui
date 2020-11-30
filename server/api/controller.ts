/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { strimziUIRequestType, strimziUIResponseType } from 'types';

export const proxyErrorHandler: (
  err: Error,
  req: strimziUIRequestType,
  res: strimziUIResponseType
) => void = (err, req, res) => {
  res.locals.strimziuicontext.logger.debug(
    { err },
    `Error occurred whilst proxying request '${req.url}'. ${err.message}`
  );
  res.sendStatus(500);
};

export const proxyStartHandler: (
  proxyReq: unknown,
  req: strimziUIRequestType,
  res: strimziUIResponseType
) => void = (_, req, res) => {
  res.locals.strimziuicontext.logger.debug(
    `Proxying request '${req.url}' to the backend api`
  );
};

export const proxyCompleteHandler: (
  proxyRes: {
    statusCode: number;
    statusMessage: string;
  },
  req: strimziUIRequestType,
  res: strimziUIResponseType
) => void = ({ statusCode, statusMessage }, req, res) => {
  res.locals.strimziuicontext.logger.debug(
    `Response from backend api for request '${req.url}' : ${statusCode} - ${statusMessage}`
  );
};
