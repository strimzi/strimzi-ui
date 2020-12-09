/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { ChangeEvent, useState, useCallback } from 'react';
import { GET_TOPICS } from 'Queries/Topics';
import { useQuery } from '@apollo/client';
import { useTopicsModelType, topicsType } from './useTopicsModel.types';
import debounce from 'lodash.debounce';

const onChangeEvent = (
  evt: ChangeEvent<HTMLInputElement>,
  callWithValue: (value: string) => void
) => callWithValue(evt.target.value);

export const useTopicsModel = (): useTopicsModelType => {
  const [filter, setTopicsFilter] = useState();
  const debouncedUpdateTopicsFilter = useCallback(
    debounce(setTopicsFilter, 500),
    []
  );
  const { data, loading, error } = useQuery<topicsType>(GET_TOPICS, {
    variables: { filter },
  });

  const model = {
    filter,
    topics: data ? data.topics : [],
    error,
    loading,
  };

  return {
    model,
    updateTopicsFilter: (evt) =>
      onChangeEvent(evt, debouncedUpdateTopicsFilter),
  };
};
