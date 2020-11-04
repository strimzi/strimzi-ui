/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import express from 'express';
import { SecureVersion } from 'tls';
import { Logger, LoggerOptions } from 'pino';

export type supportedAuthenticationStrategyTypes = 'none' | 'scram' | 'oauth';

export type authenticationConfigType = {
  /** What authentication strategy to use to authenticate users */
  strategy: supportedAuthenticationStrategyTypes;
  /** Any additional configuration required for the provided authentication strategy */
  configuration?: Record<string, unknown>;
};

type sslCertificateType = {
  /** certificate in PEM format */
  cert?: string;
  /** private key for the provided certificate */
  key?: string;
  /** TLS ciphers used/supported by the HTTPS server for client negotiation */
  ciphers?: string;
  /** Minimum TLS version supported by the server */
  minTLS?: SecureVersion;
};

type clientConfigType = {
  /** Overrides to send to the client */
  configOverrides: {
    /** location of public files to server to the client */
    publicDir: string;
  };
  /** SSL transport configuration */
  transport: sslCertificateType;
};

/** feature flag configuration overrides */
type featureFlagsConfigType = Record<string, unknown>;

type moduleConfigType = {
  /** is the api module enabled (or not) */
  api: boolean;
  /** is the client module enabled (or not) */
  client: boolean;
  /** is the config module enabled (or not) */
  config: boolean;
  /** is the log module enabled (or not) */
  log: boolean;
  /** is the mockapi module enabled (or not). Expected to be used in dev/test settings only */
  mockapi: boolean;
};

type proxyConfigType = {
  /** The Hostname of the backend server to send API requests to */
  hostname: string;
  /** The port number of the backend server to send API requests to */
  port: number;
  /** The context root for the Strimzi-admin api  */
  contextRoot: string;
  /** SSL transport configuration */
  transport: sslCertificateType;
};

export type serverConfig = {
  /** authentication configuration */
  authentication: authenticationConfigType;
  /** client (browser) facing configuration */
  client: clientConfigType;
  /** feature flag configuration overrides (for both client and server) */
  featureFlags: featureFlagsConfigType;
  /** logging configuration */
  logging: LoggerOptions;
  /** module configuration */
  modules: moduleConfigType;
  /** proxy (Strimzi-admin) configuration options */
  proxy: proxyConfigType;
  /** The Hostname to use/to accept traffic on */
  hostname: string;
  /** The port number to use/accept traffic on */
  port: number;
};

/** Re-export the pino Logger type */
export type loggerType = Logger;

/** Extend the pino Logger type with entry/exit tracing */
export type entryExitLoggerType = Logger & {
  /** function which logs entry into a function. Returns an object containing an exit loggers with the given name baked in */
  entry: (
    functionName: string,
    ...params: Array<unknown>
  ) => {
    /** called on exit of a function. Returns the parameter provided (enabling `return exit('foobar');`) */
    exit: <T>(returns: T) => T;
  };
};

export type strimziUIContextType = {
  /** configuration passed to the server */
  config: serverConfig;
  /** the unique id for this request */
  requestID: string;
  /** a pre-configured logger object to use for the life of this request */
  logger: entryExitLoggerType;
};

interface addModule {
  /** function called to add a module to the UI server */
  (
    mountLogger: entryExitLoggerType,
    authFunction: expressMiddleware,
    configAtServerStart: serverConfig
  ): {
    /** the root/mounting point for requests made to this module */
    mountPoint: string;
    /** an express router to handle requests on behalf of this module */
    routerForModule: express.Router;
  };
}

export type UIServerModule = {
  /** the name of this module. Compared against moduleConfigType keys at runtime to enable/disable modules */
  moduleName: string;
  /** function called to mount the module/allow it to handle requests  */
  addModule: addModule;
};

export interface expressMiddleware {
  /** typing of a general piece of express middleware */
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void;
}
/** the request object provided on UI server request. Core express request plus additions */
export type strimziUIRequestType = express.Request & {
  headers: {
    /** unique identifier for a request. If not present, will be added by the core module, and returned in the response */
    'x-strimzi-ui-request': string;
  };
};
/** the response object provided on UI server request. Core express request plus additions */
export type strimziUiResponseType = express.Response & {
  locals: {
    /** the context object for this request/response */
    strimziuicontext: strimziUIContextType;
  };
};
