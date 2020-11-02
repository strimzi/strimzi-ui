/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { ApolloClient, HttpLink, split, InMemoryCache } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const subscriptionClient = new SubscriptionClient('/api', {
  reconnect: true,
});

const subscriptionLink = new WebSocketLink(subscriptionClient);

const configLink = new HttpLink({ uri: '/config' });

const splitLink = split(
  (operation) => operation.getContext().purpose === 'config',
  configLink,
  subscriptionLink
);

const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default apolloClient;
