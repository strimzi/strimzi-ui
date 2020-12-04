/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { withApolloProviderReturning } from 'utils/test';
import { useTopicsModel } from './Model';
import {
  mockGetTopicsRequests,
  mockGetTopicsResponses,
} from './useTopicsModel.assets';

describe('`useTopics` hook', () => {
  describe('`useGetTopics` hook', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns the expected content', async () => {
      const { result, rerender } = renderHook(
        () => useTopicsModel().useGetTopics(),
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
        jest.runAllTimers();
      });
      rerender();

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(
        mockGetTopicsResponses.successResponse
      );
    });

    it('returns the expected content when filtering topics', async () => {
      const { result, rerender } = renderHook(
        () => useTopicsModel().useGetTopics('testtopic1'),
        {
          wrapper: ({ children }) =>
            withApolloProviderReturning(
              [mockGetTopicsRequests.successFilteredRequest],
              <React.Fragment>{children}</React.Fragment>
            ),
        }
      );

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeUndefined();

      await act(async () => {
        jest.runAllTimers();
      });

      rerender();

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(
        mockGetTopicsResponses.successFilteredResponse
      );
    });
  });
});
