/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { And, Then, Fusion } from 'jest-cucumber-fusion';
import { stepWithWorld } from 'test_common/commonServerSteps';

Then(
  'I get the expected log response',
  stepWithWorld((world) => {
    const { request } = world;
    return request.expect(426);
  })
);

And(
  'I send a logging WebSocket message',
  stepWithWorld(async (world) => {
    const { websocket } = world;

    websocket.send(
      JSON.stringify([
        {
          clientLevel: 'warn',
          msg: 'test logging message',
        },
      ])
    );
  })
);

And(
  'I send a logging WebSocket message without a clientLevel',
  stepWithWorld(async (world) => {
    const { websocket } = world;
    websocket.send(
      JSON.stringify([
        {
          msg: 'test logging message',
        },
      ])
    );
  })
);

And(
  'I send a non-string logging WebSocket message',
  stepWithWorld(async (world) => {
    const { websocket } = world;
    websocket.send(new ArrayBuffer(10));
  })
);

And(
  'I send a logging WebSocket message that is not a JSON array',
  stepWithWorld(async (world) => {
    const { websocket } = world;
    websocket.send(
      JSON.stringify({
        clientLevel: 'warn',
        msg: 'test logging message',
      })
    );
  })
);

And(
  'I send an unparsable string logging WebSocket message',
  stepWithWorld(async (world) => {
    const { websocket } = world;
    websocket.send('{this is not: "json"}');
  })
);

Fusion('log.feature');
