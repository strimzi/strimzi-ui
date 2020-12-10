/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { RequestHandler } from 'express';

export interface Authentication {
  authenticate: RequestHandler;
  checkAuth: RequestHandler;
  logout: RequestHandler;
}

export interface User {
  name: string;
  accessToken: string;
}
