/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import { Expectations } from '../ExpectationTypes';

export default {
  Other: {
    type: 'Other',
    fields: {
      names: '[String]',
      size: 'Int', // TODO how do we handle args?
      roughSize: 'TShirtSize',
      requiredRoughSize: 'TShirtSize!',
      possibleRoughSizes: '[TShirtSize]',
      requiredNames: '[String]!',
      nonNullNames: '[String!]',
      nonNullRequiredNames: '[String!]!',
      topics: '[Topic]',
    },
  },
  Topic: {
    type: 'Topic', // the GraphQL type name
    fields: {
      name: 'String!', // the expected GraphQL type - could be string or object - which is checked if is available and thus query-able
      partitions: 'Float',
      replicas: 'Int',
    },
    operations: {
      create: ({ mutations }) => {
        return mutations['createTopic'] !== undefined;
      }, // function that checks for a named mutation which provides the ability to create a topic for example
      update: ({ mutations }) => {
        return mutations['updateTopic'] !== undefined;
      },
      delete: ({ mutations }) => {
        return mutations['deleteTopic'] !== undefined;
      },
      findByName: ({ queries }) => {
        return (
          queries['topicsByName'] !== undefined &&
          queries['topicsByName'].args.findIndex((v) => v.name === 'name') > -1
        );
      },
    },
    subscriptions: {
      topicsUpdate: ({ subscriptions }) => {
        return subscriptions['topicAdded'] &&
          subscriptions['topicAdded'].type.kind === 'OBJECT' &&
          subscriptions['topicAdded'].type.name === 'Topic';
      }, // function that checks for a named subscription which relates to topics
    },
  },
} as Expectations;
