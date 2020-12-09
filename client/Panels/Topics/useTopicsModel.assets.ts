/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { generateMockDataResponseForGQLRequest } from 'utils/test/withApollo/withApollo.util';
import { topicType } from './useTopicsModel.types';
import { GET_TOPICS } from 'Queries/Topics';

const successResponse: topicType[] = [
  { name: 'testtopic1', partitions: 1, replicas: 1 },
  { name: 'testtopic2', partitions: 2, replicas: 2 },
  { name: 'testtopic3', partitions: 3, replicas: 3 },
];

const successFilteredResponse: topicType[] = [
  { name: 'testtopic1', partitions: 1, replicas: 1 },
];

export const mockGetTopicsResponses = {
  successResponse,
  successFilteredResponse,
};

const successRequest = generateMockDataResponseForGQLRequest(
  GET_TOPICS,
  { topics: successResponse },
  { variables: { filter: undefined } }
);

const successFilteredRequest = generateMockDataResponseForGQLRequest(
  GET_TOPICS,
  { topics: successFilteredResponse },
  { variables: { filter: 'testtopic1' } }
);

export const mockGetTopicsRequests = {
  successRequest,
  successFilteredRequest,
};
