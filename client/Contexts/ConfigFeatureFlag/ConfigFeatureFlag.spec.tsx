/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React, { FunctionComponent } from 'react';
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GET_CONFIG } from 'Queries/Config';
import { withApolloProviderReturning, apolloMockResponse } from 'utils/test';
import {
  ConfigFeatureFlagProvider,
  ConfigFeatureFlagConsumer,
  useConfigFeatureFlag,
} from './Context';
import { defaultClientConfig } from './ConfigFeatureFlag.assets';

describe('ConfigFeatureFlag', () => {
  const mockClientResponse = {
    version: '1.2.3',
  };
  const mockFeatureFlagResponse = {
    client: {
      Home: {
        showVersion: true,
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
                  expect(rawResponse).toEqual(defaultClientConfig);
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
      it('returns the expected values when in loading state', () => {
        const expectedClient = defaultClientConfig.client;
        const expectedFeatureFlags = defaultClientConfig.featureFlags;
        const { getByText } = render(
          withApolloProviderReturning(
            noOpResponse,
            <ConfigFeatureFlagProvider>
              <ConfigFeatureFlagConsumer>
                {({ client, featureFlags, loading, error, isComplete }) => {
                  const status = { loading, error, isComplete };
                  return (
                    <React.Fragment>
                      <p>{JSON.stringify(client)}</p>
                      <p>{JSON.stringify(featureFlags)}</p>
                      <p>{JSON.stringify(status)}</p>
                    </React.Fragment>
                  );
                }}
              </ConfigFeatureFlagConsumer>
            </ConfigFeatureFlagProvider>
          )
        );
        act(() => {
          expect(getByText(JSON.stringify(expectedClient))).toBeInTheDocument();
          expect(
            getByText(JSON.stringify(expectedFeatureFlags))
          ).toBeInTheDocument();
          expect(
            getByText(
              JSON.stringify({ loading: true, error: false, isComplete: false })
            )
          ).toBeInTheDocument();
        });
      });

      it('returns the expected values when the query completes', async () => {
        const expectedClient = mockClientResponse;
        const expectedFeatureFlags = mockFeatureFlagResponse;
        const { getByText } = render(
          withApolloProviderReturning(
            successResponse,
            <ConfigFeatureFlagProvider>
              <ConfigFeatureFlagConsumer>
                {({ client, featureFlags, loading, error, isComplete }) => {
                  const status = { loading, error, isComplete };
                  return (
                    <React.Fragment>
                      <p>{JSON.stringify(client)}</p>
                      <p>{JSON.stringify(featureFlags)}</p>
                      <p>{JSON.stringify(status)}</p>
                    </React.Fragment>
                  );
                }}
              </ConfigFeatureFlagConsumer>
            </ConfigFeatureFlagProvider>
          )
        );
        expect(
          getByText(
            JSON.stringify({ loading: true, error: false, isComplete: false })
          )
        ).toBeInTheDocument();
        await apolloMockResponse();
        expect(
          getByText(
            JSON.stringify({ loading: false, error: false, isComplete: true })
          )
        ).toBeInTheDocument();
        expect(getByText(JSON.stringify(expectedClient))).toBeInTheDocument();
        expect(
          getByText(JSON.stringify(expectedFeatureFlags))
        ).toBeInTheDocument();
      });

      it('returns the expected values when the query errors', async () => {
        const expectedClient = defaultClientConfig.client;
        const expectedFeatureFlags = defaultClientConfig.featureFlags;
        const { getByText } = render(
          withApolloProviderReturning(
            errorResponse,
            <ConfigFeatureFlagProvider>
              <ConfigFeatureFlagConsumer>
                {({
                  client,
                  featureFlags,
                  loading,
                  error,
                  isComplete,
                  rawResponse,
                }) => {
                  const status = { loading, error, isComplete, rawResponse };
                  return (
                    <React.Fragment>
                      <p>{JSON.stringify(client)}</p>
                      <p>{JSON.stringify(featureFlags)}</p>
                      <p>{JSON.stringify(status)}</p>
                    </React.Fragment>
                  );
                }}
              </ConfigFeatureFlagConsumer>
            </ConfigFeatureFlagProvider>
          )
        );
        expect(
          getByText(
            JSON.stringify({
              loading: true,
              error: false,
              isComplete: false,
              rawResponse: defaultClientConfig,
            })
          )
        ).toBeInTheDocument();
        await apolloMockResponse();
        expect(
          getByText(
            JSON.stringify({
              loading: false,
              error: true,
              isComplete: false,
              rawResponse: {
                graphQLErrors: [],
                networkError: {},
                message: mockError.message,
              },
            })
          )
        ).toBeInTheDocument();
        expect(getByText(JSON.stringify(expectedClient))).toBeInTheDocument();
        expect(
          getByText(JSON.stringify(expectedFeatureFlags))
        ).toBeInTheDocument();
      });

      it('triggers a re query of config data when `triggerRefetch` is invoked', async () => {
        const { getByText } = render(
          withApolloProviderReturning(
            [...errorResponse, ...successResponse],
            <ConfigFeatureFlagProvider>
              <ConfigFeatureFlagConsumer>
                {({
                  client,
                  featureFlags,
                  error,
                  isComplete,
                  triggerRefetch,
                }) => {
                  const status = { error, isComplete };
                  return (
                    <React.Fragment>
                      <p>{JSON.stringify(client)}</p>
                      <p>{JSON.stringify(featureFlags)}</p>
                      <p>{JSON.stringify(status)}</p>
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
          getByText(JSON.stringify({ error: true, isComplete: false }))
        ).toBeInTheDocument();
        expect(
          getByText(JSON.stringify(defaultClientConfig.client))
        ).toBeInTheDocument();
        expect(
          getByText(JSON.stringify(defaultClientConfig.featureFlags))
        ).toBeInTheDocument();
        // trigger the refetch
        userEvent.click(getByText('Refetch'));
        // 2nd tick - refetch should have completed
        await apolloMockResponse();
        expect(
          getByText(JSON.stringify({ error: false, isComplete: true }))
        ).toBeInTheDocument();
        expect(
          getByText(JSON.stringify(mockClientResponse))
        ).toBeInTheDocument();
        expect(
          getByText(JSON.stringify(mockFeatureFlagResponse))
        ).toBeInTheDocument();
      });
    });
  });

  describe('`useConfigFeatureFlag` hook', () => {
    const HookWrapper: FunctionComponent = () => {
      const { triggerRefetch, ...others } = useConfigFeatureFlag();
      return (
        <p>
          {JSON.stringify({
            ...others,
            triggerRefetch: typeof triggerRefetch === 'function',
          })}
        </p>
      );
    };

    // functions are not stringified, so expect the HookWrapper to return true if it is present
    const expectedHookValue = {
      client: { version: '' },
      featureFlags: {},
      loading: true,
      error: false,
      isComplete: false,
      rawResponse: { client: { version: '' }, featureFlags: {} },
      triggerRefetch: true,
    };

    // The functions/responses/behaviours of the hook are the same as the components, tested above. This test verifies the hook returns the expected state
    it('returns the expected context state', () => {
      const { getByText } = render(
        withApolloProviderReturning(
          noOpResponse,
          <ConfigFeatureFlagProvider>
            <HookWrapper />
          </ConfigFeatureFlagProvider>
        )
      );
      expect(getByText(JSON.stringify(expectedHookValue))).toBeInTheDocument();
    });
  });
});
