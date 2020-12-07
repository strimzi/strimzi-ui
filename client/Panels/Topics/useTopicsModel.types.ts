/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { ApolloError } from '@apollo/client';
import { ChangeEvent } from 'react';

/** the shape of the object returned by the useTopicsModel hook */
export type useTopicsModelType = {
  model: {
    filter: string | undefined;
    topics: topicType[];
    error: ApolloError | undefined;
    loading: boolean;
  };
  updateTopicsFilter: (evt: ChangeEvent<HTMLInputElement>) => void;
};

export type topicsType = {
  topics: topicType[];
};

export type topicType = {
  name: string;
  partitions: number;
  replicas: number;
};
