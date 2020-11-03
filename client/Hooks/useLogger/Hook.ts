/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { useEffect, useRef } from 'react';

const MESSAGE_BUFFER_MAX_SIZE = 100;
// TODO: Replace with the regex from the LOGGING query param
const defaultLoggingRegex = /.*/;
// TODO: Replace with the web socket address from config
const defaultWebSocketAddress = 'ws://localhost:3000/log';
const defaultClientID = 'defaultClientID';

type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

interface loggerMessage {
  clientTime: number;
  clientID: string;
  clientLevel: LogLevel;
  componentName: string;
  msg: string;
}

export const useLogger: (string) => (LogLevel, string) => void = (
  componentName: string
) => {
  // TODO: store the logger websocket in context, so you get one for the whole UI, rather than one every time you call useLogger.
  const loggerWebSocketRef = useRef<WebSocket | null>(null);
  const loggerMessageBufferRef = useRef<loggerMessage[]>([]);

  useEffect(() => {
    // Check if the component should be logged
    if (defaultLoggingRegex.test(componentName)) {
      const loggerMessageBuffer = loggerMessageBufferRef.current;

      if (!loggerWebSocketRef.current) {
        // WebSocket client does not exist - create it
        const webSocket = new WebSocket(defaultWebSocketAddress);
        webSocket.onopen = () => {
          if (loggerMessageBuffer.length > 0) {
            webSocket.send(JSON.stringify(loggerMessageBuffer));
            // Clear the message buffer
            loggerMessageBuffer.length = 0;
          }
        };
        webSocket.onclose = () => {
          // Clear the message buffer
          loggerMessageBuffer.length = 0;
        };
        webSocket.onerror = (evt) => console.error('WebSocket error:', evt);
        loggerWebSocketRef.current = webSocket;
      } else if (loggerWebSocketRef.current.readyState === WebSocket.OPEN) {
        // WebSocket is in OPEN state, send any buffered messages and the new message
        loggerWebSocketRef.current.send(JSON.stringify(loggerMessageBuffer));
        // Clear the message buffer
        loggerMessageBuffer.length = 0;
      }
    }
  });

  const logger = (clientLevel: LogLevel, msg: string) => {
    // Check if the component should be logged
    if (defaultLoggingRegex.test(componentName)) {
      const loggerWebSocket = loggerWebSocketRef.current;
      const loggerMessageBuffer = loggerMessageBufferRef.current;

      // Add a new new message to the buffer
      loggerMessageBuffer.push({
        clientTime: Date.now(), // client timestamp in ms
        clientID: defaultClientID, // client ID
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

  return logger;
};
