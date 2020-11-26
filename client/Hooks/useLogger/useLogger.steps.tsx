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

import React, { useRef } from 'react';
jest.mock('react', () => {
  const originReact = jest.requireActual('react');
  const useRef = jest.fn();
  return {
    ...originReact,
    useRef,
  };
});

import { useLogger, LoggerType, MESSAGE_BUFFER_MAX_SIZE } from '.';
import { LoggingProvider } from 'Contexts';

let logger: LoggerType;
let rerenderHook: (newProps?: { children: unknown }) => void;
let mockWebSocketServer: Server;
let originalWindowLocation: Location;
let onConnectionPromise: Promise<void>;
let onMessagePromise: Promise<string>;
let sentMessagesCount = 0;

Before(() => {
  originalWindowLocation = window.location;
});

After(() => {
  sentMessagesCount = 0;
  if (mockWebSocketServer) {
    mockWebSocketServer.close();
  }
  window.location = originalWindowLocation;
});

Given(/^a(?: (secure))* logging WebSocket server$/, (isSecure) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete window.location;
  window.location = {
    ...originalWindowLocation,
    protocol: isSecure ? 'https:' : 'http:',
    host: 'mytestserver:3000',
  };
  mockWebSocketServer = new Server(
    `${isSecure ? 'wss' : 'ws'}://mytestserver:3000/log`
  );

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
  window.location.search = `?LOGGING=${loggingParamValue}`;
});

const useLoggerHookIsRendered = 'the useLogger hook is rendered';
const useLoggerHookIsRenderedFn = () => {
  const initialRef = { current: { websocket: null, messageBuffer: [] } };
  (useRef as jest.Mock).mockReturnValue(initialRef);
  const wrapper = ({ children }) => (
    <LoggingProvider>{children}</LoggingProvider>
  );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const renderedHook = renderHook(() => useLogger('TestComponent'), {
    wrapper,
  });
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
