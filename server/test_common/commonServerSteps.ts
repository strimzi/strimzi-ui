/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import request from 'supertest';
import { returnExpress } from 'core';
import { Given, When, And, Then } from 'jest-cucumber-fusion';
import {
  serverConfigType,
  strimziUIRequestType,
  strimziUIResponseType,
} from 'types';
import { getConfigForName } from './testConfigs';
import express from 'express';
import merge from 'lodash.merge';
import {
  genericWorldType,
  worldGenerator,
} from '../../test_common/jest_cucumber_support/commonTestTypes';
import { requests } from './testGQLRequests';

import MockedWebSocket from 'ws';
jest.mock('ws');

type supertestRequestType = request.SuperTest<request.Test>;

interface serverWorldType extends genericWorldType {
  server: supertestRequestType;
  request: request.Test;
  app: express.Application;
  configuration: serverConfigType;
  websocket: WebSocket;
}

const serverWorld: serverWorldType = {
  server: {} as supertestRequestType,
  request: {} as request.Test,
  app: {} as express.Application,
  configuration: getConfigForName('default'),
  websocket: {} as WebSocket,
  context: {},
};

const { resetWorld, stepWhichUpdatesWorld, stepWithWorld } = worldGenerator(
  serverWorld
);

beforeEach(() => {
  resetWorld();
});

Given(
  /a '(.+)' server configuration/,
  stepWhichUpdatesWorld((world, config) => {
    return {
      ...world,
      configuration: getConfigForName(config as string),
    };
  })
);

And(
  'Authentication is required',
  stepWhichUpdatesWorld((world) => {
    const { configuration } = world;
    return {
      ...world,
      configuration: merge(configuration, {
        authentication: { strategy: 'oauth' },
      }),
    };
  })
);

And(
  'I run an instance of the Strimzi-UI server',
  stepWhichUpdatesWorld((world) => {
    const app = returnExpress(() => world.configuration);
    return {
      ...world,
      app,
      server: request(app),
    };
  })
);

And(
  'I enable WebSocket connections on the Strimzi-UI server',
  stepWhichUpdatesWorld((world) => {
    let { app } = world;
    const websocket = getMockedWebSocket();

    // Redirect calls to /websockettest/* back to the app with the prefix removed and the mock websocket set up.
    app = app.use('/websockettest', (req, res) => {
      (req as strimziUIRequestType).isWs = true;
      (res as strimziUIResponseType).ws = websocket;
      // req.url has `/websockettest` prefix removed, so calling the app will now route to the rest of the URL
      req.app(req, res);
      // Return the 101 switching protocols response
      res.status(101).end();
    });

    return {
      ...world,
      app,
      server: request(app),
      websocket,
    };
  })
);

When(
  /^I make a '(.+)' request to '(.+)'$/,
  stepWhichUpdatesWorld((world, method, endpoint) => {
    const { server } = world;
    return {
      ...world,
      request: server[method as string](endpoint),
    };
  })
);

When(
  /^I make a '(.+)' gql request to '(.+)'$/,
  stepWhichUpdatesWorld((world, requestName, endpoint) => {
    const { server } = world;

    const query = requests[requestName as string] || {};

    return {
      ...world,
      request: server.post(endpoint as string).send(query),
    };
  })
);

When(
  /^I make a WebSocket connection request to '(.+)'$/,
  stepWithWorld(async (world, endpoint) => {
    const { server } = world;

    // Set up the websocket
    await server.get(`/websockettest${endpoint}`).then(
      (res) => {
        expect(res.status).toBe(101);
      },
      (err) => {
        throw err;
      }
    );
  })
);

Then(
  /^the WebSocket has received (\d+) messages$/,
  stepWithWorld(async (world, messageCount) => {
    const { websocket } = world;
    expect(websocket.onmessage).toHaveBeenCalledTimes(
      parseInt(messageCount as string)
    );
  })
);

And(
  'I close the WebSocket',
  stepWithWorld(async (world) => {
    const { websocket } = world;
    websocket.close(0, 'Test close');
  })
);

And(
  'the WebSocket is closed',
  stepWithWorld(async (world) => {
    const { websocket } = world;
    expect(websocket.onclose).toHaveBeenCalledTimes(1);
    expect(websocket.onclose).toHaveBeenCalledWith({
      code: 0,
      reason: 'Test close',
      target: websocket,
      wasClean: true,
    });
  })
);

const getMockedWebSocket: () => MockedWebSocket = () => {
  const websocket = new MockedWebSocket('ws://testwebsocket:1234');

  // Add mock `on`, `send` and `close` functions
  websocket.on = (event, listener) => {
    if (event === 'message') {
      websocket.onmessage = jest.fn(listener);
    } else if (event === 'close') {
      websocket.onclose = jest.fn(listener);
    }
    return websocket;
  };
  websocket.send = (data) => websocket.onmessage(data);
  websocket.close = (code: number, reason: string) =>
    websocket.onclose({
      code,
      reason,
      target: websocket,
      wasClean: true,
    });

  return websocket;
};

export { stepWhichUpdatesWorld, stepWithWorld };
