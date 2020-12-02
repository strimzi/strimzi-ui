/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { GET_TOPICS } from 'Queries/Topics';
import { useQuery } from '@apollo/client';
import { useTopicsType } from './useTopics.types';

export const useTopics = (): useTopicsType => {
  const useGetTopics = () => useQuery(GET_TOPICS);
  return {
    useGetTopics,
  };
};
