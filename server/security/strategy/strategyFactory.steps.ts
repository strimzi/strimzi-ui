/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { When, Then, Fusion } from 'jest-cucumber-fusion';
import {
  stepWhichUpdatesWorld,
  stepWithWorld,
} from 'test_common/commonServerSteps';

import { AuthenticationStrategy, getStrategy } from './strategyFactory';
import { authenticationStrategies } from 'types';
import {
  AuthOptions,
  NoAuth,
  OAuthOptions,
  ScramOptions,
} from 'security/types';

jest.mock('passport-openidconnect');
jest.mock('passport-local');

When(
  /^a strategy factory is asked for type '(.+)'$/,
  stepWhichUpdatesWorld((world, type) => {
    const context = world.context;
    const config: AuthOptions = ((type: authenticationStrategies) => {
      switch (type) {
        case authenticationStrategies.SCRAM:
          return {
            type: authenticationStrategies.SCRAM,
            endpoint: '',
          } as ScramOptions;
        case authenticationStrategies.OAUTH:
          return {
            type: authenticationStrategies.OAUTH,
            options: {
              issuer: '',
              authorizationURL: '',
              tokenURL: '',
              userInfoURL: '',
              logoutURL: '',
              clientID: '',
              clientSecret: '',
              callbackURL: '',
            },
          } as OAuthOptions;
        case authenticationStrategies.NONE:
        default:
          return {
            type: authenticationStrategies.NONE,
          } as NoAuth;
      }
    })(type as authenticationStrategies);

    context.strategy = getStrategy(config);
    return {
      ...world,
      context,
    };
  })
);

Then(
  /^the returned strategy is of type '(.+)'$/,
  stepWithWorld((world, type) => {
    const { context } = world;
    const strategy = context.strategy as AuthenticationStrategy;
    expect(strategy.name).toEqual(type as string);
  })
);

Fusion('strategyFactory.feature');
