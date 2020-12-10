/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { gql } from 'apollo-server-express';
// placeholder GQL schema for a topic/topic list - ideally to come from file
export const schema = gql`
  type Topic {
    name: String
    partitions: Int
    replicas: Int
  }
  type Query {
    topic(name: String): Topic
    topics: [Topic]
    clusterInfo: String
  }
`;
