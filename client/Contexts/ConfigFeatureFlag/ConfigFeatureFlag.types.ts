/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { ApolloError, QueryResult } from '@apollo/client';
import { exposedClientType, exposedFeatureFlagsType } from 'ui-config';

/** the response (`data`) value from the graphql config query (client/Queries/Config/index.ts) */
export type apolloQueryResponseType = {
  /** all client values returned */
  client: exposedClientType;
  /** all feature flag values returned */
  featureFlags: exposedFeatureFlagsType;
};
/** the shape of the `value` returned by the `ConfigFeatureFlag` provider */
export type ConfigFeatureFlagType = {
  /** retrieved client configuration values */
  client: exposedClientType;
  /** retrieved feature flag values */
  featureFlags: exposedFeatureFlagsType;
  /** is the request for config in progress? `true` if so, else `false` */
  loading: boolean;
  /** did the request error? `true` if so, else `false` */
  error: boolean;
  /** has the request completed (ie it is not in either loading or error state)? `true` if so, else `false` */
  isComplete: boolean;
  /** the raw response from apollo - either the error object, the data object, or an empty object (before a load or error occurs) */
  rawResponse: ApolloError | QueryResult | Record<string, unknown>;
  /** function to trigger a new fetch of configuration. Expected to be used in error scenarios */
  triggerRefetch: () => void;
};
