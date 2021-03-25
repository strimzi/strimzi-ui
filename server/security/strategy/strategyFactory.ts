/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { Strategy } from 'passport';
import { authenticationStrategies, proxyConfigType } from 'types';
import { Strategy as LocalStrategy } from 'passport-local';
import { createVerifyCallback as createSaslCallback } from './scram/scramAuthenticator';

export interface AuthenticationStrategy {
  name: string;
  strategy: Strategy;
}

export const getStrategy = (
  config: proxyConfigType
): AuthenticationStrategy => {
  const authConfig = config.authentication;

  const strategy = {
    name: authConfig.type.toString(),
  };
  switch (authConfig.type) {
    case authenticationStrategies.SCRAM: {
      const endpoint = `http://${config.hostname}:${config.port}${config.contextRoot}`; //TODO https support
      return {
        ...strategy,
        strategy: new LocalStrategy(createSaslCallback(endpoint)),
      };
    }
    case authenticationStrategies.NONE:
    default: {
      return {
        name: authenticationStrategies.NONE,
        strategy: new Strategy(),
      };
    }
  }
};
