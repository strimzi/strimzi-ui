/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import axios from 'axios';
import { VerifyFunction } from 'passport-local';
import { generateLogger } from 'logging';

const logger = generateLogger('ScramAuthenticator');

const createVerifyCallback = (endpoint: string): VerifyFunction => {
  const { exit } = logger.entry('createVerifyCallback');

  const verify = async (username, password, done) => {
    const { exit } = logger.entry('createVerifyCallback - callback');
    const query = { query: 'query {clusterInfo}' };
    try {
      const token = Buffer.from(`${username}:${password}`).toString('base64');
      const basicAuth = `Basic ${token}`;
      const { data } = await axios.post(endpoint, query, {
        //TODO HTTPS support
        headers: {
          Authentication: basicAuth,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (data.errors) {
        logger.error('Error in Admin server response', data.errors);
        return exit(done(null, false));
      }

      return exit(done(null, { username, token: basicAuth }));
    } catch (err) {
      logger.error('Error with admin server', err);
      return exit(done(err, null));
    }
  };
  return exit(verify);
};

export { createVerifyCallback };
