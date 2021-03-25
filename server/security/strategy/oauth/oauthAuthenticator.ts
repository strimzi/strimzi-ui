/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { generateLogger } from 'logging';
import { VerifyFunction } from 'passport-openidconnect';

const logger = generateLogger('OauthAuthenticator');

const createVerifyCallback = (): VerifyFunction => {
  const { exit } = logger.entry('createVerifyCallback');

  const verify = (
    _issuer,
    username,
    _profile,
    accessToken,
    _refreshToken,
    done
  ) => {
    const { exit } = logger.entry('createVerifyCallback - callback');

    return exit(done(null, { username, token: accessToken }));
  };
  return exit(verify);
};

export { createVerifyCallback };
