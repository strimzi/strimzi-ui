/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { generateMockDataResponseForGQLRequest } from 'utils/test/withApollo/withApollo.util';
import { topicsType } from './useTopics.types';
import { GET_TOPICS } from 'Queries/Topics';

export const mockGetTopicsResponse: topicsType = {
  topics: [
    { name: 'testtopic1', partitions: 1, replicas: 1 },
    { name: 'testtopic2', partitions: 2, replicas: 2 },
    { name: 'testtopic3', partitions: 3, replicas: 3 },
  ],
};

const successRequest = generateMockDataResponseForGQLRequest(
  GET_TOPICS,
  mockGetTopicsResponse
);

export const mockGetTopicsRequests = {
  successRequest,
};
