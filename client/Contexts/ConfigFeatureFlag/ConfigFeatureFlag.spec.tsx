/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

// we need to be able to control the response from one util function, while testing another. Thus create a custom mock to control the response from `getLocation`
const getLocationMock = jest.fn();
jest.mock('Utils', () => {
  return {
    ...(jest.requireActual('Utils') as Record<string, unknown>),
    getLocation: getLocationMock,
  };
});

import React from 'react';
import { render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import merge from 'lodash.merge';
import { withApolloProviderReturning, apolloMockResponse } from 'utils/test';
import {
  ConfigFeatureFlagProvider,
  ConfigFeatureFlagConsumer,
} from './Context';
import {
  defaultClientConfig,
  defaultConfigFeatureFlagValue,
  mockData,
  mockRequests,
} from './ConfigFeatureFlag.assets';

import { ConfigFeatureFlagType } from './ConfigFeatureFlag.types';
import { Literal } from 'ui-config/types';
import { MockedResponse } from '@apollo/client/testing';

describe('ConfigFeatureFlag', () => {
  const { noOpRequest, successRequest, errorRequest } = mockRequests;
  const { mockClientResponse, mockFeatureFlagResponse, mockError } = mockData;

  const addContainerWithBootstrapMeta: (
    config?: Record<string, Literal>
  ) => { container: HTMLElement } = (config) => {
    const metaElement = document.createElement('meta');
    metaElement.name = 'bootstrapConfigs';
    if (config) {
      metaElement.content = encodeURIComponent(JSON.stringify(config));
    }
    return { container: document.body.appendChild(metaElement) };
  };

  const renderProviderConsumerSeededWith: (
    responses: Array<MockedResponse<Record<string, unknown>>>,
    renderFn: (value: ConfigFeatureFlagType) => JSX.Element,
    renderOptions?: Record<string, unknown>
  ) => RenderResult = (responses, renderFn, renderOptions = {}) =>
    render(
      withApolloProviderReturning(
        responses,
        <ConfigFeatureFlagProvider>
          <ConfigFeatureFlagConsumer>{renderFn}</ConfigFeatureFlagConsumer>
        </ConfigFeatureFlagProvider>
      ),
      renderOptions
    );

  describe('`ConfigFeatureFlagProvider` and `ConfigFeatureFlagConsumer` components', () => {
    beforeEach(() => {
      getLocationMock.mockReturnValue(new URL('http://random.com'));
    });

    describe('initial state', () => {
      it('returns the default client configuration values', () => {
        const expectedValues = defaultClientConfig.client;
        const { getByText } = renderProviderConsumerSeededWith(
          [noOpRequest],
          ({ client }) => {
            return <p>{JSON.stringify(client)}</p>;
          }
        );
        expect(getByText(JSON.stringify(expectedValues))).toBeInTheDocument();
      });

      it('returns the default featureFlags configuration values', () => {
        const expectedValues = defaultClientConfig.featureFlags;
        const { getByText } = renderProviderConsumerSeededWith(
          [noOpRequest],
          ({ featureFlags }) => {
            return <p>{JSON.stringify(featureFlags)}</p>;
          }
        );
        expect(getByText(JSON.stringify(expectedValues))).toBeInTheDocument();
      });

      it('returns the expected default bootstrap configuration values', () => {
        const bootstrapConfigValues =
          defaultConfigFeatureFlagValue.bootstrapConfig;
        const { getByText } = renderProviderConsumerSeededWith(
          [noOpRequest],
          ({ bootstrapConfig }) => {
            return <p>{JSON.stringify(bootstrapConfig)}</p>;
          },
          addContainerWithBootstrapMeta(bootstrapConfigValues)
        );
        expect(
          getByText(JSON.stringify(bootstrapConfigValues))
        ).toBeInTheDocument();
      });

      it('returns the default state values on mount', () => {
        // check the documented external states/functions are provided to consumers
        renderProviderConsumerSeededWith(
          [noOpRequest],
          ({ loading, error, isComplete, triggerRefetch, rawResponse }) => {
            expect(loading).toBe(true);
            expect(error).toBe(false);
            expect(isComplete).toBe(false);
            expect(rawResponse).toEqual({});
            expect(triggerRefetch).toEqual(expect.any(Function));
            return <p>{JSON.stringify(isComplete)}</p>;
          }
        );
      });
    });

    describe('response handling and context value reduction logic', () => {
      // define common expected states, namespaces so RTL getByText can identify them
      const stringifyForRender: (
        ns: string
      ) => (value: unknown) => Record<string, typeof value> = (ns) => (
        value
      ) => ({ [ns]: value });
      const clientWhenRendered = stringifyForRender('client');
      const featureFlagsWhenRendered = stringifyForRender('featureFlags');
      const bootstrapConfigWhenRendered = stringifyForRender('bootStrap');
      const statusWhenRendered = stringifyForRender('status');
      const functionWhenRendered = stringifyForRender('functions');

      const emptyClientResponse = clientWhenRendered(
        defaultClientConfig.client
      );
      const emptyFeatureFlagResponse = featureFlagsWhenRendered(
        defaultClientConfig.featureFlags
      );

      const returnClientResponse = clientWhenRendered(mockClientResponse);
      const returnFeatureFlagResponse = featureFlagsWhenRendered(
        mockFeatureFlagResponse
      );

      const initialLoadingStatus = statusWhenRendered({
        loading: true,
        error: false,
        isComplete: false,
        rawResponse: {},
      });

      const errorStatus = statusWhenRendered({
        loading: false,
        error: true,
        isComplete: false,
        rawResponse: {
          graphQLErrors: [],
          networkError: {},
          message: mockError.message,
        },
      });

      const successStatus = statusWhenRendered({
        loading: false,
        error: false,
        isComplete: true,
        rawResponse: {
          client: mockClientResponse,
          featureFlags: mockFeatureFlagResponse,
        },
      });

      const defaultBootstrapConfig = bootstrapConfigWhenRendered(
        defaultConfigFeatureFlagValue.bootstrapConfig
      );
      const bootstrapConfigValue = {};
      const withBootstrapConfig = bootstrapConfigWhenRendered(
        bootstrapConfigValue
      );

      const testRenderFunc: (value: ConfigFeatureFlagType) => JSX.Element = ({
        client,
        featureFlags,
        bootstrapConfig,
        loading,
        error,
        isComplete,
        rawResponse,
        triggerRefetch,
      }) => (
        <React.Fragment>
          <p>{JSON.stringify(clientWhenRendered(client))}</p>
          <p>{JSON.stringify(featureFlagsWhenRendered(featureFlags))}</p>
          <p>{JSON.stringify(bootstrapConfigWhenRendered(bootstrapConfig))}</p>
          <p>
            {JSON.stringify(
              statusWhenRendered({ loading, error, isComplete, rawResponse })
            )}
          </p>
          <p>
            {JSON.stringify(
              functionWhenRendered({
                triggerRefetch: typeof triggerRefetch === 'function',
              })
            )}
          </p>
        </React.Fragment>
      );

      it('returns the expected values when in loading state', async () => {
        const expectedClient = emptyClientResponse;
        const expectedFeatureFlags = emptyFeatureFlagResponse;
        const expectedBootstrapConfig = defaultBootstrapConfig;
        const expectedStatus = initialLoadingStatus;
        const { getByText } = renderProviderConsumerSeededWith(
          [noOpRequest],
          testRenderFunc
        );
        await waitFor(() => {
          expect(getByText(JSON.stringify(expectedClient))).toBeInTheDocument();
          expect(
            getByText(JSON.stringify(expectedFeatureFlags))
          ).toBeInTheDocument();
          expect(
            getByText(JSON.stringify(expectedBootstrapConfig))
          ).toBeInTheDocument();
          expect(getByText(JSON.stringify(expectedStatus))).toBeInTheDocument();
        });
      });

      it('returns the expected bootstrap config values', async () => {
        const expectedClient = emptyClientResponse;
        const expectedFeatureFlags = emptyFeatureFlagResponse;
        const expectedBootstrapConfig = bootstrapConfigValue;
        const expectedStatus = initialLoadingStatus;

        const { getByText } = renderProviderConsumerSeededWith(
          [noOpRequest],
          testRenderFunc,
          addContainerWithBootstrapMeta(expectedBootstrapConfig)
        );

        await waitFor(() => {
          expect(getByText(JSON.stringify(expectedClient))).toBeInTheDocument();
          expect(
            getByText(JSON.stringify(expectedFeatureFlags))
          ).toBeInTheDocument();
          expect(
            getByText(JSON.stringify(withBootstrapConfig))
          ).toBeInTheDocument();
          expect(getByText(JSON.stringify(expectedStatus))).toBeInTheDocument();
        });
      });

      it('merges feature flag state from the URL if present as expected', async () => {
        const urlFeatureFlagState =
          '?ff=random=input,client.Home.showVersion=false';
        const expectedShapeForInput = {
          random: false,
          client: {
            Home: {
              showVersion: false,
            },
          },
        };

        const expectedIntialFeatureFlagsFromURLOnly = featureFlagsWhenRendered(
          expectedShapeForInput
        );
        const expectedFeatureFlagsFromURLAndResponseFromServer = featureFlagsWhenRendered(
          merge({}, mockFeatureFlagResponse, expectedShapeForInput)
        );
        // set up the URL to contain our flags
        getLocationMock.mockReturnValue(
          new URL(`http://random.com/${urlFeatureFlagState}`)
        );

        const { getByText } = renderProviderConsumerSeededWith(
          [successRequest],
          testRenderFunc
        );

        expect(
          getByText(JSON.stringify(expectedIntialFeatureFlagsFromURLOnly))
        ).toBeInTheDocument();
        await apolloMockResponse(); // tick for data
        expect(
          getByText(
            JSON.stringify(expectedFeatureFlagsFromURLAndResponseFromServer)
          )
        ).toBeInTheDocument(); // confirm flags from response and URL present, with URL taking precedence if overlap
      });

      it('returns the default bootstrap config values if content is missing', async () => {
        const expectedClient = emptyClientResponse;
        const expectedFeatureFlags = emptyFeatureFlagResponse;
        const expectedStatus = initialLoadingStatus;
        const { getByText } = renderProviderConsumerSeededWith(
          [noOpRequest],
          testRenderFunc,
          addContainerWithBootstrapMeta() // no content provided
        );
        await waitFor(() => {
          expect(getByText(JSON.stringify(expectedClient))).toBeInTheDocument();
          expect(
            getByText(JSON.stringify(expectedFeatureFlags))
          ).toBeInTheDocument();
          expect(
            getByText(JSON.stringify(defaultBootstrapConfig))
          ).toBeInTheDocument();
          expect(getByText(JSON.stringify(expectedStatus))).toBeInTheDocument();
        });
      });

      it('returns the expected values when the query completes', async () => {
        const expectedClient = returnClientResponse;
        const expectedFeatureFlags = returnFeatureFlagResponse;
        const expectedBootstrapConfig = defaultBootstrapConfig;
        const expectedStatusLoading = initialLoadingStatus;
        const expectedStatusLoaded = successStatus;
        const { getByText } = renderProviderConsumerSeededWith(
          [successRequest],
          testRenderFunc
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
        expect(
          getByText(JSON.stringify(expectedBootstrapConfig))
        ).toBeInTheDocument();
      });

      it('returns the expected values when the query errors', async () => {
        const expectedClient = emptyClientResponse;
        const expectedFeatureFlags = emptyFeatureFlagResponse;
        const expectedBootstrapConfig = defaultBootstrapConfig;
        const expectedStatusLoading = initialLoadingStatus;
        const expectedStatusError = errorStatus;
        const { getByText } = renderProviderConsumerSeededWith(
          [errorRequest],
          testRenderFunc
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
        expect(
          getByText(JSON.stringify(expectedBootstrapConfig))
        ).toBeInTheDocument();
      });

      it('triggers a re query of config data when `triggerRefetch` is invoked', async () => {
        const expectedClientError = emptyClientResponse;
        const expectedFeatureFlagsError = emptyFeatureFlagResponse;
        const expectedStatusError = errorStatus;

        const expectedClientComplete = returnClientResponse;
        const expectedFeatureFlagsComplete = featureFlagsWhenRendered(
          mockFeatureFlagResponse
        );
        const expectedStatusComplete = successStatus;

        const { getByText } = renderProviderConsumerSeededWith(
          [errorRequest, successRequest],
          (values) => {
            const { triggerRefetch } = values;
            return (
              <React.Fragment>
                {testRenderFunc(values)}
                <button onClick={triggerRefetch}>Refetch</button>
              </React.Fragment>
            );
          }
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
