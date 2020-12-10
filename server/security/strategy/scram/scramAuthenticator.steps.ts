/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { When, Then, Fusion, Given, And } from 'jest-cucumber-fusion';
import {
  stepWhichUpdatesWorld,
  stepWithWorld,
} from 'test_common/commonServerSteps';

import { createVerifyCallback } from './scramAuthenticator';
import { VerifyFunction } from 'passport-local';
import nock from 'nock';

let verify: VerifyFunction;

Given(
  /^an authentication endpoint of '(\S+)'$/,
  stepWhichUpdatesWorld((world, endpoint) => {
    const context = world.context;
    context.endpoint = endpoint as string;
    context.nock = nock(context.endpoint as string);
    return {
      ...world,
      context,
    };
  })
);

And(
  /^the authentication endpoint accepts username '(\S+)' and password '(\S+)'$/,
  stepWhichUpdatesWorld((world, username, password) => {
    const token = `Basic ${Buffer.from(`${username}:${password}`).toString(
      'base64'
    )}`;
    const { context } = world;
    context.token = token;
    context.nock = (context.nock as nock.Scope)
      .matchHeader('authentication', token)
      .post('/')
      .reply(200, {});
    return {
      ...world,
      context,
    };
  })
);

And(
  'the authentication endpoint refuses any credentials',
  stepWhichUpdatesWorld((world) => {
    const { context } = world;

    context.nock = (context.nock as nock.Scope).post('/').reply(200, {
      errors: [
        {
          message: 'auth error',
        },
      ],
    });
    return {
      ...world,
      context,
    };
  })
);

And(
  'the authentication endpoint returns a server error',
  stepWhichUpdatesWorld((world) => {
    const { context } = world;

    context.nock = (context.nock as nock.Scope).post('/').reply(500);
    return {
      ...world,
      context,
    };
  })
);

When(
  'a verify callback is generated',
  stepWithWorld((world) => {
    const {
      context: { endpoint },
    } = world;
    verify = createVerifyCallback(endpoint as string);
  })
);

And(
  /^I call verify with username '(\S+)' and password '(\S+)'$/,
  stepWhichUpdatesWorld((world, username, password) => {
    return new Promise((resolve) => {
      verify(username as string, password as string, (error, user) => {
        const context = world.context;
        resolve({
          ...world,
          context: { ...context, error, user },
        });
      });
    });
  })
);

Then(
  /^the callback should return a user with username '(\S+)' and a token$/,
  stepWithWorld((world, username) => {
    const {
      context: { error, user, token },
    } = world;
    expect(error).toBeNull();
    expect(user).toEqual({ username, token });
  })
);

Then(
  /^the callback should return '(\S+)'$/,
  stepWithWorld((world, result) => {
    const {
      context: { error, user },
    } = world;
    expect(error).toBeNull();
    expect(JSON.stringify(user)).toEqual(result);
  })
);

Then(
  'the callback should return an error',
  stepWithWorld((world) => {
    const {
      context: { error, user },
    } = world;
    expect(error).toBeTruthy();
    expect(user).toBeNull();
  })
);

Fusion('scramAuthenticator.feature');
