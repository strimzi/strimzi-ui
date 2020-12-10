/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import { ApolloClient, HttpLink, split, InMemoryCache } from '@apollo/client';

declare const __API_BASE_PATH__: string;

const apiLink = new HttpLink({ uri: `${__API_BASE_PATH__}/api`, fetch });

const configLink = new HttpLink({ uri: `${__API_BASE_PATH__}/config`, fetch });

const splitLink = split(
  (operation) => operation.getContext().purpose === 'config',
  configLink,
  apiLink
);

const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export { apolloClient };
