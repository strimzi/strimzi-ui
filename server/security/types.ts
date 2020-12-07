/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { RequestHandler } from 'express';
import { authenticationStrategies } from 'types';

export interface Authentication {
  authenticate: RequestHandler;
  checkAuth: RequestHandler;
  logout: RequestHandler;
}

export interface User {
  name: string;
  accessToken: string;
}

export type AuthOptions = OAuthOptions | ScramOptions | NoAuth;

export interface NoAuth {
  type: authenticationStrategies.NONE;
}
export interface ScramOptions {
  type: authenticationStrategies.SCRAM;
  endpoint: string;
}

export interface OAuthOptions {
  type: authenticationStrategies.OAUTH;
  options: OAuthEndpoints & {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
  };
}

export interface OAuthEndpoints {
  issuer: string;
  authorizationURL: string;
  tokenURL: string;
  userInfoURL: string;
  logoutURL: string;
}
