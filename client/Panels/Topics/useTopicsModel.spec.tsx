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

describe('`useTopicsModel` hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns the expected query content', async () => {
    const { result, rerender } = renderHook(useTopicsModel, {
      wrapper: ({ children }) =>
        withApolloProviderReturning(
          [mockGetTopicsRequests.successRequest],
          <React.Fragment>{children}</React.Fragment>
        ),
    });

    expect(result.current.model.loading).toBe(true);
    expect(result.current.model.topics).toEqual([]);

    await act(async () => {
      jest.runAllTimers();
    });
    rerender();

    expect(result.current.model.topics).toEqual(
      mockGetTopicsResponses.successResponse
    );
    expect(result.current.model.loading).toBe(false);
  });
});
