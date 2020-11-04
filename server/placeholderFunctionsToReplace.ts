/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
// placeholder functions - to be replaced by actual implementation later

import express from 'express';
import { authenticationConfigType } from 'types';

// https://github.com/orgs/strimzi/projects/2#card-44265081
// function which returns a piece of express middleware for a given auth strategy
const authFunction: (
  config: authenticationConfigType
) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => void = ({ strategy }) => {
  switch (strategy) {
    default:
    case 'none':
      return (req, res, next) => next();
    case 'scram':
    case 'oauth':
      return (req, res) => res.sendStatus(511); // if auth on, reject for sake of example. This is a middleware, akin to passport doing its checks.
  }
};

export { authFunction };
