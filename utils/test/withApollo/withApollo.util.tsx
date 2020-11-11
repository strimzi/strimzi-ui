/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act } from '@testing-library/react';

/** sets up and returns the given `mockResponses` via Apollo MockedProvider
 * @param mockResponses - the responses that will be returned. Should be of the `MockedResponse` type
 * @param children - JSX, which will include one or more components making an apollo request
 * @param addTypeName - optional - Adds the `__typename` to queries/responses (which may cause queries to not match in test scenarios). Defaults to false.
 */
export const withApolloProviderReturning: (
  mockResponses: MockedResponse<Record<string, unknown>>[],
  children: JSX.Element,
  addTypeName?: boolean
) => JSX.Element = (mockResponses, children, addTypename = false) => (
  <MockedProvider mocks={mockResponses} addTypename={addTypename}>
    {children}
  </MockedProvider>
);

/** syntactic sugar - async function which skips one process tick - allowing apollo to resolve a response */
export const apolloMockResponse: () => void = async () =>
  await act(
    async () =>
      new Promise((resolve) => {
        setTimeout(resolve, 1);
      })
  );
