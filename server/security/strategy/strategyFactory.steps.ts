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
import { authenticationStrategies, proxyConfigType } from 'types';

When(
  /^a strategy factory is asked for type '(.+)'$/,
  stepWhichUpdatesWorld((world, type) => {
    const context = world.context;
    const config: proxyConfigType = {
      authentication: {
        type: type as authenticationStrategies,
      },
      hostname: '',
      port: 0,
      contextRoot: '',
      transport: {},
    };
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
