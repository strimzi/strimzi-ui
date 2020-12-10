/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import request from 'supertest';
import { returnExpress } from 'core';
import nock from 'nock';
import { Given, When, And, Then, CallBack } from 'jest-cucumber-fusion';
import {
  serverConfigType,
  strimziUIRequestType,
  strimziUIResponseType,
  authenticationStrategies,
} from 'types';
import { getConfigForName, enableModule } from './testConfigs';
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

const withModule: [RegExp, CallBack] = [
  /^a '(.+)' module$/,
  stepWhichUpdatesWorld((world, module) => {
    const { configuration } = world;

    return {
      ...world,
      configuration: enableModule(
        module as string,
        configuration as serverConfigType
      ),
    };
  }),
];

Given(...withModule);
And(...withModule);

const withConfig: [RegExp, CallBack] = [
  /^a server with a '(.+)' configuration$/,
  stepWhichUpdatesWorld((world, config) => {
    return {
      ...world,
      configuration: getConfigForName(config as string),
    };
  }),
];

Given(...withConfig);
And(...withConfig);

Given(
  'an Application',
  stepWhichUpdatesWorld((world) => {
    world.context.app = express();
    return world;
  })
);

And(
  /^authentication type '(\w+)' is required$/,
  stepWhichUpdatesWorld((world, type) => {
    const configuration = merge(world.configuration, {
      proxy: {
        authentication: { type: type as authenticationStrategies },
      },
    });
    return {
      ...world,
      configuration,
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
  'all requests use the same session',
  stepWhichUpdatesWorld((world) => {
    const { app } = world;
    return {
      ...world,
      app,
      server: request.agent(app),
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

const httpRequest: [RegExp, CallBack] = [
  /^I make a '(.+)' request to '(.+)'$/,
  stepWhichUpdatesWorld(async (world, method, endpoint) => {
    const { server } = world;
    if (world.request) {
      await world.request;
    }
    return {
      ...world,
      request: server[method as string](endpoint),
    };
  }),
];

When.call(null, ...httpRequest);
And.call(null, ...httpRequest);

When(
  /^I make a '(.+)' gql request to '(.+)'$/,
  stepWhichUpdatesWorld(async (world, requestName, endpoint) => {
    const { server } = world;
    if (world.request) {
      await world.request;
    }

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

Then(
  /I get the expected status code '(.+)' response$/,
  stepWithWorld(async (world, statusCode) => {
    const expectedStatus = parseInt(statusCode as string);
    const { request } = world;
    return request.expect(expectedStatus);
  })
);

Then(
  /I get the expected status code '(.+)' response and body '(.+)'$/,
  stepWithWorld(async (world, statusCode, response) => {
    const expectedStatus = parseInt(statusCode as string);
    const { request } = world;
    return request.expect(expectedStatus, response as string);
  })
);

And(
  'the scram authentication accepts credentials',
  stepWithWorld((world) => {
    const { hostname, contextRoot, port } = world.configuration.proxy;
    nock(`http://${hostname}:${port}`).post(contextRoot).reply(200, {});
  })
);
And(
  'the scram authentication rejects credentials',
  stepWithWorld((world) => {
    const { hostname, contextRoot, port } = world.configuration.proxy;
    nock(`http://${hostname}:${port}`)
      .post(contextRoot)
      .reply(200, { errors: ['unauth'] });
  })
);

When(
  /^I send credentials to endpoint '(.+)'$/,
  stepWhichUpdatesWorld(async (world, endpoint) => {
    const { server } = world;
    if (world.request) {
      await world.request;
    }
    return {
      ...world,
      request: server.post(endpoint as string).send({
        username: 'user',
        password: 'password',
      }),
    };
  })
);

export { stepWhichUpdatesWorld, stepWithWorld };
