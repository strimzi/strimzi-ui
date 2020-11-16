/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from 'react';
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GET_CONFIG } from 'Queries/Config';
import { withApolloProviderReturning, apolloMockResponse } from 'utils/test';
import {
  ConfigFeatureFlagProvider,
  ConfigFeatureFlagConsumer,
} from './Context';
import { defaultClientConfig } from './ConfigFeatureFlag.assets';

import { ConfigFeatureFlagType } from './ConfigFeatureFlag.types';

describe('ConfigFeatureFlag', () => {
  const mockClientResponse = {
    about: {
      version: '1.2.3',
    },
  };
  const mockFeatureFlagResponse = {
    client: {
      Home: {
        showVersion: true,
      },
      Pages: {
        PlaceholderHome: true,
      },
    },
  };

  const request = {
    query: GET_CONFIG,
    variables: {},
    context: {
      purpose: 'config',
    },
  };

  const mockError = new Error('Example error case');

  const errorResponse = [
    {
      request,
      error: mockError,
    },
  ];

  const successResponse = [
    {
      request,
      result: {
        data: {
          client: mockClientResponse,
          featureFlags: mockFeatureFlagResponse,
        },
      },
    },
  ];

  const noOpResponse = [
    {
      request,
      result: {
        data: {},
      },
    },
  ];

  describe('`ConfigFeatureFlagProvider` and `ConfigFeatureFlagConsumer` components', () => {
    describe('initial state', () => {
      it('returns the expected client configuration values', () => {
        const expectedValues = defaultClientConfig.client;
        const { getByText } = render(
          withApolloProviderReturning(
            noOpResponse,
            <ConfigFeatureFlagProvider>
              <ConfigFeatureFlagConsumer>
                {({ client }) => {
                  return <p>{JSON.stringify(client)}</p>;
                }}
              </ConfigFeatureFlagConsumer>
            </ConfigFeatureFlagProvider>
          )
        );
        expect(getByText(JSON.stringify(expectedValues))).toBeInTheDocument();
      });

      it('returns the expected featureFlags configuration values', () => {
        const expectedValues = defaultClientConfig.featureFlags;
        const { getByText } = render(
          withApolloProviderReturning(
            noOpResponse,
            <ConfigFeatureFlagProvider>
              <ConfigFeatureFlagConsumer>
                {({ featureFlags }) => {
                  return <p>{JSON.stringify(featureFlags)}</p>;
                }}
              </ConfigFeatureFlagConsumer>
            </ConfigFeatureFlagProvider>
          )
        );
        expect(getByText(JSON.stringify(expectedValues))).toBeInTheDocument();
      });

      it('returns the expected state values on mount', () => {
        // check the documented externals are provided to consumers
        render(
          withApolloProviderReturning(
            noOpResponse,
            <ConfigFeatureFlagProvider>
              <ConfigFeatureFlagConsumer>
                {({
                  loading,
                  error,
                  isComplete,
                  triggerRefetch,
                  rawResponse,
                }) => {
                  expect(loading).toBe(true);
                  expect(error).toBe(false);
                  expect(isComplete).toBe(false);
                  expect(rawResponse).toEqual({});
                  expect(triggerRefetch).toEqual(expect.any(Function));
                  return <p>{JSON.stringify(isComplete)}</p>;
                }}
              </ConfigFeatureFlagConsumer>
            </ConfigFeatureFlagProvider>
          )
        );
      });
    });
    describe('response handling logic', () => {
      // define common expected states, namespaces so RTL getByText can identify them
      const namespaceValue: (
        ns: string
      ) => (value: unknown) => Record<string, typeof value> = (ns) => (
        value
      ) => ({ [ns]: value });
      const clientNs = namespaceValue('client');
      const featureFlagsNs = namespaceValue('featureFlags');
      const statusNs = namespaceValue('status');
      const functionNs = namespaceValue('functions');

      const emptyClientResponse = clientNs(defaultClientConfig.client);
      const emptyFeatureFlagResponse = featureFlagsNs(
        defaultClientConfig.featureFlags
      );

      const returnClientResponse = clientNs(mockClientResponse);
      const returnFeatureFlagResponse = featureFlagsNs(mockFeatureFlagResponse);

      const initialLoadingStatus = statusNs({
        loading: true,
        error: false,
        isComplete: false,
        rawResponse: {},
      });

      const errorStatus = statusNs({
        loading: false,
        error: true,
        isComplete: false,
        rawResponse: {
          graphQLErrors: [],
          networkError: {},
          message: mockError.message,
        },
      });

      const successStatus = statusNs({
        loading: false,
        error: false,
        isComplete: true,
        rawResponse: {
          client: mockClientResponse,
          featureFlags: mockFeatureFlagResponse,
        },
      });

      const testRenderFunc: (value: ConfigFeatureFlagType) => JSX.Element = ({
        client,
        featureFlags,
        loading,
        error,
        isComplete,
        rawResponse,
        triggerRefetch,
      }) => (
        <React.Fragment>
          <p>{JSON.stringify(clientNs(client))}</p>
          <p>{JSON.stringify(featureFlagsNs(featureFlags))}</p>
          <p>
            {JSON.stringify(
              statusNs({ loading, error, isComplete, rawResponse })
            )}
          </p>
          <p>
            {JSON.stringify(
              functionNs({
                triggerRefetch: typeof triggerRefetch === 'function',
              })
            )}
          </p>
        </React.Fragment>
      );

      it('returns the expected values when in loading state', () => {
        const expectedClient = emptyClientResponse;
        const expectedFeatureFlags = emptyFeatureFlagResponse;
        const expectedStatus = initialLoadingStatus;
        const { getByText } = render(
          withApolloProviderReturning(
            noOpResponse,
            <ConfigFeatureFlagProvider>
              <ConfigFeatureFlagConsumer>
                {testRenderFunc}
              </ConfigFeatureFlagConsumer>
            </ConfigFeatureFlagProvider>
          )
        );
        act(() => {
          expect(getByText(JSON.stringify(expectedClient))).toBeInTheDocument();
          expect(
            getByText(JSON.stringify(expectedFeatureFlags))
          ).toBeInTheDocument();
          expect(getByText(JSON.stringify(expectedStatus))).toBeInTheDocument();
        });
      });

      it('returns the expected values when the query completes', async () => {
        const expectedClient = returnClientResponse;
        const expectedFeatureFlags = returnFeatureFlagResponse;
        const expectedStatusLoading = initialLoadingStatus;
        const expectedStatusLoaded = successStatus;
        const { getByText } = render(
          withApolloProviderReturning(
            successResponse,
            <ConfigFeatureFlagProvider>
              <ConfigFeatureFlagConsumer>
                {testRenderFunc}
              </ConfigFeatureFlagConsumer>
            </ConfigFeatureFlagProvider>
          )
        );
        expect(
          getByText(JSON.stringify(expectedStatusLoading))
        ).toBeInTheDocument();
        await apolloMockResponse();
        expect(
          getByText(JSON.stringify(expectedStatusLoaded))
        ).toBeInTheDocument();
        expect(getByText(JSON.stringify(expectedClient))).toBeInTheDocument();
        expect(
          getByText(JSON.stringify(expectedFeatureFlags))
        ).toBeInTheDocument();
      });

      it('returns the expected values when the query errors', async () => {
        const expectedClient = emptyClientResponse;
        const expectedFeatureFlags = emptyFeatureFlagResponse;
        const expectedStatusLoading = initialLoadingStatus;
        const expectedStatusError = errorStatus;
        const { getByText } = render(
          withApolloProviderReturning(
            errorResponse,
            <ConfigFeatureFlagProvider>
              <ConfigFeatureFlagConsumer>
                {testRenderFunc}
              </ConfigFeatureFlagConsumer>
            </ConfigFeatureFlagProvider>
          )
        );
        expect(
          getByText(JSON.stringify(expectedStatusLoading))
        ).toBeInTheDocument();
        await apolloMockResponse();
        expect(
          getByText(JSON.stringify(expectedStatusError))
        ).toBeInTheDocument();
        expect(getByText(JSON.stringify(expectedClient))).toBeInTheDocument();
        expect(
          getByText(JSON.stringify(expectedFeatureFlags))
        ).toBeInTheDocument();
      });

      it('triggers a re query of config data when `triggerRefetch` is invoked', async () => {
        const expectedClientError = emptyClientResponse;
        const expectedFeatureFlagsError = emptyFeatureFlagResponse;
        const expectedStatusError = errorStatus;

        const expectedClientComplete = returnClientResponse;
        const expectedFeatureFlagsComplete = featureFlagsNs(
          mockFeatureFlagResponse
        );
        const expectedStatusComplete = successStatus;

        const { getByText } = render(
          withApolloProviderReturning(
            [...errorResponse, ...successResponse],
            <ConfigFeatureFlagProvider>
              <ConfigFeatureFlagConsumer>
                {(values) => {
                  const { triggerRefetch } = values;
                  return (
                    <React.Fragment>
                      {testRenderFunc(values)}
                      <button onClick={triggerRefetch}>Refetch</button>
                    </React.Fragment>
                  );
                }}
              </ConfigFeatureFlagConsumer>
            </ConfigFeatureFlagProvider>
          )
        );
        // 1st tick - error state
        await apolloMockResponse();
        expect(
          getByText(JSON.stringify(expectedStatusError))
        ).toBeInTheDocument();
        expect(
          getByText(JSON.stringify(expectedClientError))
        ).toBeInTheDocument();
        expect(
          getByText(JSON.stringify(expectedFeatureFlagsError))
        ).toBeInTheDocument();
        // trigger the refetch
        userEvent.click(getByText('Refetch'));
        // 2nd tick - refetch should have completed
        await apolloMockResponse();
        expect(
          getByText(JSON.stringify(expectedStatusComplete))
        ).toBeInTheDocument();
        expect(
          getByText(JSON.stringify(expectedClientComplete))
        ).toBeInTheDocument();
        expect(
          getByText(JSON.stringify(expectedFeatureFlagsComplete))
        ).toBeInTheDocument();
      });
    });
  });
});
