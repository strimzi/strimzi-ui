/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import {
  And,
  Given,
  When,
  Then,
  Fusion,
  After,
  Before,
} from 'jest-cucumber-fusion';
import { renderHook } from '@testing-library/react-hooks';
import { Server } from 'mock-socket';

import { useLogger, LoggerType, MESSAGE_BUFFER_MAX_SIZE } from '.';

let logger: LoggerType;
let rerenderHook: (newProps?: unknown) => void;
let mockWebSocketServer: Server;
let originalWindowLocation: Location;
let onConnectionPromise: Promise<void>;
let onMessagePromise: Promise<string>;
let sentMessagesCount = 0;
let verifiedClient = true;

Before(() => {
  originalWindowLocation = window.location;
});

After(() => {
  sentMessagesCount = 0;
  mockWebSocketServer.close();
  verifiedClient = true;
  window.location = originalWindowLocation;
});

Given('a logging WebSocket server', () => {
  mockWebSocketServer = new Server('ws://localhost:3000/log', {
    verifyClient: () => verifiedClient,
  });

  onConnectionPromise = new Promise((onConnectionResolve) =>
    mockWebSocketServer.on('connection', (socket) => {
      onMessagePromise = new Promise((onMessageResolve) =>
        socket.on('message', (data) => onMessageResolve(data as string))
      );
      onConnectionResolve();
    })
  );
});

And(/^the LOGGING query param is set to '(.*)'$/, (loggingParamValue) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete window.location;
  window.location = {
    ...originalWindowLocation,
    search: `?LOGGING=${loggingParamValue}`,
  };
});

const useLoggerHookIsRendered = 'the useLogger hook is rendered';
const useLoggerHookIsRenderedFn = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const renderedHook = renderHook(() => useLogger('TestComponent'));
  logger = renderedHook.result.current;
  expect(logger).not.toBeNull();
  expect(logger).not.toBeUndefined();
  rerenderHook = renderedHook.rerender;
  expect(rerenderHook).not.toBeNull();
  expect(rerenderHook).not.toBeUndefined();
};
When(useLoggerHookIsRendered, useLoggerHookIsRenderedFn);
And(useLoggerHookIsRendered, useLoggerHookIsRenderedFn);

And('the useLogger hook is re-rendered', () => {
  rerenderHook();
});

When('the useLogger hook is rendered with an empty componentName', () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const renderedHook = renderHook(() => useLogger(''));
  logger = renderedHook.result.current;
  expect(logger).not.toBeNull();
  expect(logger).not.toBeUndefined();
});

And(
  /^(\d+) (fatal|error|warn|info|debug|trace)-level messages* (?:are|is) logged$/,
  (messagesCount, logLevel) => {
    const requestedMessagesCount =
      parseInt(messagesCount as string) + sentMessagesCount;
    for (
      let index = sentMessagesCount + 1;
      index <= requestedMessagesCount;
      index++
    ) {
      logger[logLevel as string](`useLogger test message ${index}`);
    }
    sentMessagesCount = requestedMessagesCount;
  }
);

const useLoggerHookIsConnected =
  'the useLogger hook is connnected to the WebSocket server';
const useLoggerHookIsConnectedFn = () => {
  expect(mockWebSocketServer.clients().length).toBe(1);
  return onConnectionPromise;
};
Then(useLoggerHookIsConnected, useLoggerHookIsConnectedFn);
And(useLoggerHookIsConnected, useLoggerHookIsConnectedFn);

Then('the useLogger hook does not connnect to the WebSocket server', () => {
  expect(mockWebSocketServer.clients().length).toBe(0);
});

const loggingMessagesAreReceived = /^(\d+) (fatal|error|warn|info|debug|trace)-level logging messages* (?:are|is) received by the WebSocket server$/;
const loggingMessagesAreReceivedFn = async (messagesCount, logLevel) => {
  const expectedLoggingMessagesCount = parseInt(messagesCount as string);

  const receivedMessageEvent = await onMessagePromise;
  expect(receivedMessageEvent).not.toBeNull();
  const parsedLoggingMessages = JSON.parse(receivedMessageEvent);
  expect(parsedLoggingMessages.length).toBe(expectedLoggingMessagesCount);

  let startingIndex = 1;
  if (sentMessagesCount > MESSAGE_BUFFER_MAX_SIZE) {
    expect(parsedLoggingMessages.length).toBe(MESSAGE_BUFFER_MAX_SIZE);
    startingIndex = sentMessagesCount - MESSAGE_BUFFER_MAX_SIZE + 1;
  }

  for (let index = 0; index < expectedLoggingMessagesCount; index++) {
    expect(parsedLoggingMessages[index].clientLevel).toEqual(logLevel);
    expect(parsedLoggingMessages[index].componentName).toEqual('TestComponent');
    expect(parsedLoggingMessages[index].msg).toEqual(
      `useLogger test message ${index + startingIndex}`
    );
  }
};
Then(loggingMessagesAreReceived, loggingMessagesAreReceivedFn);
And(loggingMessagesAreReceived, loggingMessagesAreReceivedFn);

And('the WebSocket server rejects the useLogger connection', () => {
  mockWebSocketServer.simulate('error');
});

Then('the useLogger hook is disconnnected from the WebSocket server', () => {
  expect(mockWebSocketServer.clients().length).toBe(1);
  // Should be Websocket.CLOSED but is currently undefined due to https://github.com/thoov/mock-socket/pull/240
  expect(mockWebSocketServer.clients()[0].readyState).toBeUndefined();
});

Fusion('useLogger.feature');
