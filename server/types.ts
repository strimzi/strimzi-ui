/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import express from 'express';
import WebSocket from 'ws';
import { SecureVersion } from 'tls';
import { Level, Logger, LoggerOptions } from 'pino';
import { exposedClientType, exposedFeatureFlagsType } from 'ui-config/types';
import { Authentication } from 'security';

export enum authenticationStrategies {
  NONE = 'none',
  SCRAM = 'scram',
}

export interface authenticationConfig {
  /** What authentication strategy to use to authenticate users */
  type: authenticationStrategies;
}

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
  configOverrides: exposedClientType;
  /** SSL transport configuration */
  transport: sslCertificateType;
  /** location of public files to server to the client */
  publicDir: string;
};

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

export type proxyConfigType = {
  /** The Hostname of the backend server to send API requests to */
  hostname: string;
  /** The port number of the backend server to send API requests to */
  port: number;
  /** The context root for the Strimzi-admin api  */
  contextRoot: string;
  /** SSL transport configuration */
  transport: sslCertificateType;
  /** authentication configuration */
  authentication: authenticationConfig;
};

type sessionConfigType = {
  /** Name used to create the session cookie */
  name: string;
};

export type serverConfigType = {
  /** client (browser) facing configuration */
  client: clientConfigType;
  /** feature flag configuration overrides (for both client and server) */
  featureFlags: exposedFeatureFlagsType;
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
  /** Configuration for a creation/management of a session */
  session: sessionConfigType;
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
  config: serverConfigType;
  /** the unique id for this request */
  requestID: string;
  /** a pre-configured logger object to use for the life of this request */
  logger: entryExitLoggerType;
};

interface addModule {
  /** function called to add a module to the UI server */
  (
    mountLogger: entryExitLoggerType,
    authentication: Authentication,
    configAtServerStart: serverConfigType
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

/** the request object provided on UI server request. Core express request plus additions */
export type strimziUIRequestType = express.Request & {
  /** indicates this request is a websocket request (and that the response will have a ws object to interact with) */
  isWs: boolean | false;
  headers: {
    /** unique identifier for a request. If not present, will be added by the core module, and returned in the response */
    'x-strimzi-ui-request': string;
  };
};
/** the response object provided on UI server request. Core express request plus additions */
export type strimziUIResponseType = express.Response & {
  ws: WebSocket;
  locals: {
    /** the context object for this request/response */
    strimziuicontext: strimziUIContextType;
  };
};

export interface ClientLoggingEvent {
  clientTime: number;
  clientID: string;
  clientLevel: Level;
  componentName: string;
  msg: string;
}
