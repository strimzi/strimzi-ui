/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { Strategy } from 'passport';
import { authenticationStrategies } from 'types';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as OAuth2Strategy } from 'passport-openidconnect';
import { createVerifyCallback as createSaslCallback } from './scram/scramAuthenticator';
import { createVerifyCallback as createOauthCallback } from './oauth/oauthAuthenticator';
import { AuthOptions, ScramOptions, OAuthOptions } from '../types';
import { generateLogger } from 'logging';

export interface AuthenticationStrategy {
  name: string;
  strategy: Strategy;
}

const logger = generateLogger('strategyFactory');

export const getStrategy = (config: AuthOptions): AuthenticationStrategy => {
  const { exit } = logger.entry('getStrategy', config);
  switch (config.type) {
    case authenticationStrategies.SCRAM: {
      const scramConfig = config as ScramOptions;
      return exit({
        name: config.type,
        strategy: new LocalStrategy(createSaslCallback(scramConfig.endpoint)),
      });
    }
    case authenticationStrategies.OAUTH: {
      const oAuthConfig = config as OAuthOptions;
      return exit({
        name: oAuthConfig.type,
        strategy: new OAuth2Strategy(
          oAuthConfig.options,
          createOauthCallback()
        ),
      });
    }
    case authenticationStrategies.NONE:
    default: {
      return exit({
        name: authenticationStrategies.NONE,
        strategy: new Strategy(),
      });
    }
  }
};
