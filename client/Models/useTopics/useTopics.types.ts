/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { QueryResult } from '@apollo/client';

/** the shape of the object returned by the useTopics hook */
export type useTopicsType = {
  useGetTopics: () => QueryResult<topicsType>;
};

/** the shape of the `data` returned by the useGetTopics hook */
export type topicsType = {
  topics: topicType[];
};

export type topicType = {
  name: string;
  partitions: number;
  replicas: number;
};
