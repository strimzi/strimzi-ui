/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act } from '@testing-library/react';
import { DocumentNode } from 'graphql';

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

/**
 * Helper to return a `MockedResponse` shape for simulating responses from Apollo
 *
 * !IMPORTANT! the query, any variables (provided via `additionalRequestOptions`) and the `data` must match _exactly_ for Apollo's mock link to return them.
 *
 * @param query - the GQL request to make.
 * @param data - the data returned on completion of the request
 * @param error - the error to return on completion of the request
 * @param additionalRequestOptions - additional options to provide when making the request. A common example would be `variables` provided to the request.
 */
export const generateMockResponseForGQLRequest: <T>(
  query: DocumentNode,
  data?: T,
  error?: Error,
  additionalRequestOptions?: Record<string, unknown>
) => MockedResponse<T> = (
  query,
  data,
  error,
  additionalRequestOptions = {}
) => ({
  request: {
    query,
    ...additionalRequestOptions,
  },
  result: data
    ? {
      data,
    }
    : {},
  error: error ? error : undefined,
});

/**
 * Helper to return a `MockedResponse` shape containing `data` when simulating responses from Apollo in tests/storybook
 *
 * !IMPORTANT! the query, any variables (provided via `additionalRequestOptions`) and the `data` must match _exactly_ for Apollo's mock link to return them.
 *
 * @param query - the GQL request to make.
 * @param data - the data returned on completion of the request
 * @param additionalRequestOptions - additional options to provide when making the request. A common example would be `variables` provided to the request.
 */
export const generateMockDataResponseForGQLRequest: (
  query: DocumentNode,
  data: Record<string, unknown>,
  additionalRequestOptions?: Record<string, unknown>
) => MockedResponse<typeof data> = (
  query,
  data,
  additionalRequestOptions = {}
) =>
  generateMockResponseForGQLRequest<typeof data>(
    query,
    data,
    undefined,
    additionalRequestOptions
  );

/**
 *  Helper to return a `MockedResponse` shape containing an `error` when simulating responses from Apollo in tests/storybook
 *
 * !IMPORTANT! the query and any variables (provided via `additionalRequestOptions`) must match _exactly_ for Apollo's mock link to return them.
 *
 * @param query - the GQL request to make.
 * @param error - the error response to return when the request completes
 * @param additionalRequestOptions - additional options to provide when making the request. A common example would be `variables` provided to the request.
 */
export const generateMockErrorResponseForGQLRequest: (
  query: DocumentNode,
  error: Error,
  additionalRequestOptions?: Record<string, unknown>
) => MockedResponse<Record<string, Error>> = (
  query,
  error,
  additionalRequestOptions = {}
) =>
  generateMockResponseForGQLRequest<Record<string, Error>>(
    query,
    undefined,
    error,
    additionalRequestOptions
  );
