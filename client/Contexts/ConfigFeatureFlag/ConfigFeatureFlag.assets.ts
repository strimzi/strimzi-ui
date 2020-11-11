/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { ApolloError } from '@apollo/client';
import { exposedClientType, exposedFeatureFlagsType } from 'ui-config';

export type apolloQueryResponseType = {
  client: exposedClientType;
  featureFlags: exposedFeatureFlagsType;
};

export type ConfigFeatureFlagType = {
  client: exposedClientType;
  featureFlags: exposedFeatureFlagsType;
  loading: boolean;
  error: boolean;
  isComplete: boolean;
  rawResponse: ApolloError | apolloQueryResponseType;
  triggerRefetch: () => void;
};

export const defaultClientConfig: apolloQueryResponseType = {
  client: {
    version: '',
  },
  featureFlags: {},
};

/** default values/schema for this context */
export const defaultConfigFeatureFlagValue: ConfigFeatureFlagType = {
  ...defaultClientConfig,
  loading: false,
  error: false,
  isComplete: true,
  rawResponse: defaultClientConfig,
  // ignore for code coverage - exists to provide the shape defined by ConfigFeatureFlagType
  triggerRefetch: /* istanbul ignore next */ () => {
    // NO-OP - placeholder
  },
};
