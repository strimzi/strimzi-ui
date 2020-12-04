/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { useState, useEffect } from 'react';
import { GET_TOPICS } from 'Queries/Topics';
import { useQuery } from '@apollo/client';
import {
  useTopicsModelType,
  useGetTopicsResultType,
} from './useTopicsModel.types';

export const useTopicsModel = (): useTopicsModelType => {
  const useGetTopics = (filter?: string): useGetTopicsResultType => {
    // Use debounce to ensure char-by-char changes to the filter string do not cause floods of useQuery network calls
    const debouncedFilter = useDebounce(filter, 500);
    // Caching in useQuery means that new network calls are only made when the debouncedFilter value changes
    return useQuery(GET_TOPICS, { variables: { filter: debouncedFilter } });
  };

  return {
    useGetTopics,
  };
};

// Adapted from https://usehooks.com/useDebounce/
const useDebounce = <T>(value: T, delay: number): T => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => setDebouncedValue(value), delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      return () => clearTimeout(handler);
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
};
