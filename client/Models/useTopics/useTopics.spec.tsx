/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { withApolloProviderReturning, apolloMockResponse } from 'utils/test';
import { useTopics } from './Hook';
import {
  mockGetTopicsRequests,
  mockGetTopicsResponse,
} from './useTopics.assets';

describe('`useTopics` hook', () => {
  describe('`useGetTopics` hook', () => {
    it('returns the expected content', async () => {
      const { result, rerender } = renderHook(
        () => useTopics().useGetTopics(),
        {
          wrapper: ({ children }) =>
            withApolloProviderReturning(
              [mockGetTopicsRequests.successRequest],
              <React.Fragment>{children}</React.Fragment>
            ),
        }
      );

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeUndefined();

      await act(async () => {
        await apolloMockResponse();
      });
      rerender();

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockGetTopicsResponse);
    });
  });
});
