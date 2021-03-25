/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import merge from 'lodash.merge';
import { And, Fusion, Then } from 'jest-cucumber-fusion';
import {
  stepWhichUpdatesWorld,
  stepWithWorld,
} from 'test_common/commonServerSteps';

And(
  'There are no files to serve',
  stepWhichUpdatesWorld((world) => {
    return {
      ...world,
      configuration: merge(world.configuration, {
        client: {
          publicDir: '/dir/that/does/not/exist',
        },
      }),
    };
  })
);

And('There are files to serve', () => {
  // NO_OP - the `client` configuration is already configured to serve fixture files
});

Then(
  /I get the expected status code '(.+)' response/,
  stepWithWorld((world, statusCode) => {
    const expectedStatus = parseInt(statusCode as string);
    const { request } = world;
    return request.expect(expectedStatus);
  })
);

Then(
  'the file is returned as with the expected configuration included',
  stepWithWorld(async (world) => {
    const { request, configuration } = world;
    const configuredAuthType = configuration.proxy.authentication.type;

    await request.then(
      (res) => {
        const { status, text } = res;
        // pull required configuration from the world, and create the expected shape from them
        const expectedConfig = encodeURIComponent(
          JSON.stringify({ authType: configuredAuthType })
        );
        expect(status).toBe(200);
        expect(text.includes(expectedConfig)).toBe(true);
      },
      (err) => {
        throw err;
      }
    );
  })
);

Fusion('client.feature');
