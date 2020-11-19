/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
// deliberately not using the barrel as causes a circular dependency
import {
  generateMockDataResponseForGQLRequest,
  generateMockErrorResponseForGQLRequest,
} from 'utils/test/withApollo/withApollo.util';
import {
  ConfigFeatureFlagType,
  ApolloQueryResponseType,
} from './ConfigFeatureFlag.types';
import { GET_CONFIG } from 'Queries/Config';

export const defaultClientConfig: ApolloQueryResponseType = {
  client: {},
  featureFlags: {},
};

/** default values/schema for this context */
export const defaultConfigFeatureFlagValue: ConfigFeatureFlagType = {
  ...defaultClientConfig,
  bootstrapConfig: {
    auth: 'none',
  },
  loading: false,
  error: false,
  isComplete: true,
  rawResponse: {},
  // ignore for code coverage - exists to provide the shape defined by ConfigFeatureFlagType
  triggerRefetch: /* istanbul ignore next */ () => {
    // NO-OP - placeholder
  },
};

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

const mockError = new Error('Example error case');

export const mockData = {
  mockClientResponse,
  mockFeatureFlagResponse,
  mockError,
};

const additionalRequestArgs = {
  variables: {},
  context: {
    purpose: 'config',
  },
};

const noOpRequest = generateMockDataResponseForGQLRequest(
  GET_CONFIG,
  {},
  additionalRequestArgs
);
const successRequest = generateMockDataResponseForGQLRequest(
  GET_CONFIG,
  {
    client: mockClientResponse,
    featureFlags: mockFeatureFlagResponse,
  },
  additionalRequestArgs
);
const errorRequest = generateMockErrorResponseForGQLRequest(
  GET_CONFIG,
  mockError,
  additionalRequestArgs
);

export const mockRequests = {
  noOpRequest,
  successRequest,
  errorRequest,
};
