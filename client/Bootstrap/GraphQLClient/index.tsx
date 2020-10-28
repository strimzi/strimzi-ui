/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from '@apollo/link-ws';
import config from '../../../config';

const client = new SubscriptionClient(config.GRAPHQL_ENDPOINT, {
  reconnect: true,
});

const link = new WebSocketLink(client);

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default apolloClient;
