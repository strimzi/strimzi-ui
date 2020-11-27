/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { LogLevel, LoggingContext } from 'Contexts';

export const MESSAGE_BUFFER_MAX_SIZE = 100;

export type LoggerType = {
  log: (clientLevel: LogLevel, msg: string) => void;
  fatal: (msg: string) => void;
  error: (msg: string) => void;
  warn: (msg: string) => void;
  info: (msg: string) => void;
  debug: (msg: string) => void;
  trace: (msg: string) => void;
};

// Unique client ID created when this module is loaded
const clientID = uuidv4();

/**
 * Checks if the component should be logged by checking if the LOGGING
 * query parameter regex metches the component name.
 *
 * @param componentName the component name to check
 */
const shouldLogComponent = (componentName: string): boolean => {
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

const getWebSocketAddress = (): string => {
  return `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${
    window.location.host
  }/log`;
};

export const useLogger = (componentName: string): LoggerType => {
  // Get the logging state from the Logging context
  const loggingRef = useContext(LoggingContext);

  useEffect(() => {
    // Check if the component should be logged
    if (shouldLogComponent(componentName) && loggingRef) {
      const { websocket: loggerWebSocket, messageBuffer } = loggingRef.current;

      if (!loggerWebSocket) {
        // WebSocket client does not exist - create it
        const websocket = new WebSocket(getWebSocketAddress());
        websocket.onopen = () => {
          if (messageBuffer.length > 0) {
            // WebSocket is now open, send anything in the message buffer and clear it
            const serializedMessageBuffer = JSON.stringify(messageBuffer);
            websocket.send(serializedMessageBuffer);
            messageBuffer.length = 0;
          }
        };
        websocket.onclose = () => {
          // WebSocket is closing, clear the message buffer
          messageBuffer.length = 0;
        };
        websocket.onerror = (err) => console.error('WebSocket error:', err);
        loggingRef.current.websocket = websocket;
      } else if (loggerWebSocket.readyState === WebSocket.OPEN) {
        // WebSocket is in OPEN state, send anything in the message buffer and clear it
        loggerWebSocket.send(JSON.stringify(messageBuffer));
        messageBuffer.length = 0;
      }
    }
  });

  const log = (clientLevel: LogLevel, msg: string) => {
    // Check if the component should be logged
    if (shouldLogComponent(componentName) && loggingRef) {
      const { websocket, messageBuffer } = loggingRef.current;

      // Add a new new message to the buffer
      messageBuffer.push({
        clientTime: Date.now(), // client timestamp in ms
        clientID, // client ID
        clientLevel, // logging level
        componentName, // client component name
        msg, // log message
      });

      if (websocket && websocket.readyState === WebSocket.OPEN) {
        // WebSocket is in OPEN state, send any buffered messages and the new message
        const serializedMessageBuffer = JSON.stringify(messageBuffer);
        websocket.send(serializedMessageBuffer);
        // Clear the message buffer
        messageBuffer.length = 0;
      } else {
        // WebSocket is not in OPEN state, so update the messages buffer, ensuring it is not larger than the max size
        if (messageBuffer.length > MESSAGE_BUFFER_MAX_SIZE) {
          messageBuffer.splice(
            0,
            messageBuffer.length - MESSAGE_BUFFER_MAX_SIZE
          );
        }
      }
    }
  };

  const genLog = (clientLevel: LogLevel) => (msg: string) =>
    log(clientLevel, msg);

  return {
    log,
    fatal: genLog(LogLevel.fatal),
    error: genLog(LogLevel.error),
    warn: genLog(LogLevel.warn),
    info: genLog(LogLevel.info),
    debug: genLog(LogLevel.debug),
    trace: genLog(LogLevel.trace),
  };
};
