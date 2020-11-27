/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import gql from 'graphql-tag';

export const GET_CONFIG = gql`
  query {
    client {
      about {
        version
      }
    }
    featureFlags {
      client {
        Home {
          showVersion
        }
        Pages {
          PlaceholderHome
        }
      }
    }
  }
`;
