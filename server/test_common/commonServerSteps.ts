/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import request from 'supertest';
import { returnExpress } from 'core';
import { Given, When, And } from 'jest-cucumber-fusion';
import { serverConfig } from 'types';
import { getConfigForName } from './testConfigs';
import express from 'express';
import merge from 'lodash.merge';
import {
  genericWorldType,
  worldGenerator,
} from '../../test_common/jest_cucumber_support/commonTestTypes';

type supertestRequestType = request.SuperTest<request.Test>;

interface serverWorldType extends genericWorldType {
  server: supertestRequestType;
  request: request.Test;
  app: express.Application;
  configuration: serverConfig;
}

const serverWorld: serverWorldType = {
  server: {} as supertestRequestType,
  request: {} as request.Test,
  app: {} as express.Application,
  configuration: getConfigForName('default'),
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
    return {
      ...world,
      server: request(returnExpress('test-server', () => world.configuration)),
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

export { stepWhichUpdatesWorld, stepWithWorld };
