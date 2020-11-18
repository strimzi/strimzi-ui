/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const MESSAGE_BUFFER_MAX_SIZE = 100;

// TODO: Replace with the web socket address from config
const defaultWebSocketAddress = 'ws://localhost:3000/log';

// Unique client ID created when this module is loaded
const clientID = uuidv4();

export type LogLevelType =
  | 'fatal'
  | 'error'
  | 'warn'
  | 'info'
  | 'debug'
  | 'trace';

interface loggerMessage {
  clientTime: number;
  clientID: string;
  clientLevel: LogLevelType;
  componentName: string;
  msg: string;
}

export type LoggerType = {
  log: (clientLevel: LogLevelType, msg: string) => void;
  fatal: (msg: string) => void;
  error: (msg: string) => void;
  warn: (msg: string) => void;
  info: (msg: string) => void;
  debug: (msg: string) => void;
  trace: (msg: string) => void;
};

/**
 * Checks if the component should be logged by checking if the LOGGING
 * query parameter regex metches the component name.
 *
 * @param componentName the component name to check
 */
const shouldLogComponent: (componentName: string) => boolean = (
  componentName: string
) => {
  let shouldLogComponent = false;
  // Retrieve the logging regex from the URL LOGGING query param
  if (window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const loggingParam = params.get('LOGGING');
    if (loggingParam) {
      const loggingRegex = new RegExp(loggingParam);
      shouldLogComponent = loggingRegex.test(componentName);
    }
  }

  return shouldLogComponent;
};

export const useLogger: (componentName: string) => LoggerType = (
  componentName: string
) => {
  // TODO: store the logger websocket in context, so you get one for the whole UI, rather than one every time you call useLogger.
  const loggerWebSocketRef = useRef<WebSocket | null>(null);
  const loggerMessageBufferRef = useRef<loggerMessage[]>([]);

  useEffect(() => {
    // Check if the component should be logged
    if (shouldLogComponent(componentName)) {
      const loggerWebSocket = loggerWebSocketRef.current;
      const loggerMessageBuffer = loggerMessageBufferRef.current;

      if (!loggerWebSocket) {
        // WebSocket client does not exist - create it
        const webSocket = new WebSocket(defaultWebSocketAddress);
        webSocket.onopen = () => {
          if (loggerMessageBuffer.length > 0) {
            // WebSocket is now open, send anything in the message buffer and clear it
            webSocket.send(JSON.stringify(loggerMessageBuffer));
            loggerMessageBuffer.length = 0;
          }
        };
        webSocket.onclose = () => {
          // WebSocket is closing, clear the message buffer
          loggerMessageBuffer.length = 0;
        };
        webSocket.onerror = (err) => console.error('WebSocket error:', err);

        loggerWebSocketRef.current = webSocket;
      } else if (loggerWebSocket.readyState === WebSocket.OPEN) {
        // WebSocket is in OPEN state, send anything in the message buffer and clear it
        loggerWebSocket.send(JSON.stringify(loggerMessageBuffer));
        loggerMessageBuffer.length = 0;
      }
    }
  });

  const log = (clientLevel: LogLevelType, msg: string) => {
    // Check if the component should be logged
    if (shouldLogComponent(componentName)) {
      const loggerWebSocket = loggerWebSocketRef.current;
      const loggerMessageBuffer = loggerMessageBufferRef.current;

      // Add a new new message to the buffer
      loggerMessageBuffer.push({
        clientTime: Date.now(), // client timestamp in ms
        clientID, // client ID
        clientLevel, // logging level
        componentName, // client component name
        msg, // log message
      });

      if (loggerWebSocket && loggerWebSocket.readyState === WebSocket.OPEN) {
        // WebSocket is in OPEN state, send any buffered messages and the new message
        loggerWebSocket.send(JSON.stringify(loggerMessageBuffer));
        // Clear the message buffer
        loggerMessageBuffer.length = 0;
      } else {
        // WebSocket is not in OPEN state, so update the messages buffer, ensuring it is not larger than the max size
        if (loggerMessageBuffer.length > MESSAGE_BUFFER_MAX_SIZE) {
          loggerMessageBuffer.splice(
            0,
            loggerMessageBuffer.length - MESSAGE_BUFFER_MAX_SIZE
          );
        }
      }
    }
  };

  const genLog = (clientLevel: LogLevelType) => (msg: string) =>
    log(clientLevel, msg);

  return {
    log,
    fatal: genLog('fatal'),
    error: genLog('error'),
    warn: genLog('warn'),
    info: genLog('info'),
    debug: genLog('debug'),
    trace: genLog('trace'),
  };
};
