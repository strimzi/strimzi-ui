/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
export const entitiesBasic = {
  Other: {
    fields: {
      names: true,
      size: true,
      roughSize: true,
      requiredRoughSize: true,
      possibleRoughSizes: true,
      requiredNames: true,
      nonNullNames: true,
      nonNullRequiredNames: true,
      topics: true,
    },
    operations: {},
    subscriptions: {},
    type: 'Other',
  },
  Topic: {
    fields: { name: true, partitions: false, replicas: true },
    operations: { create: true, update: true, delete: false, findByName: true },
    subscriptions: { topicsUpdate: true },
    type: 'Topic',
  },
};
