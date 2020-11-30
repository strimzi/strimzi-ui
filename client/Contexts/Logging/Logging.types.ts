/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
export type LoggingStateType = {
  websocket: WebSocket | null;
  messageBuffer: loggerMessage[];
};

export interface loggerMessage {
  clientTime: number;
  clientID: string;
  clientLevel: LogLevel;
  componentName: string;
  msg: string;
}

export enum LogLevel {
  fatal = 'fatal',
  error = 'error',
  warn = 'warn',
  info = 'info',
  debug = 'debug',
  trace = 'trace',
}

export type LogLevelType = keyof typeof LogLevel;
