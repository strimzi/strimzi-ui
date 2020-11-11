/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { createContext, FunctionComponent, useContext } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CONFIG } from 'Queries/Config';
import {
  apolloQueryResponseType,
  ConfigFeatureFlagType,
  defaultClientConfig,
  defaultConfigFeatureFlagValue,
} from './ConfigFeatureFlag.assets';

const ConfigFeatureFlag = createContext(defaultConfigFeatureFlagValue);
/** useConfigFeatureFlag - hook which returns the current value of the ConfigFeatureFlag context */
const useConfigFeatureFlag: () => ConfigFeatureFlagType = () =>
  useContext(ConfigFeatureFlag);
/** ConfigFeatureFlagConsumer - consumer component of the ConfigFeatureFlag context */
const ConfigFeatureFlagConsumer = ConfigFeatureFlag.Consumer;
/** Test provider. Only to be used in tests */
const _ConfigFeatureFlag_TestProvider = ConfigFeatureFlag.Provider;
/** ConfigFeatureFlagProvider - component which sets up and provides a value to the ConfigFeatureFlag context. Should only be used in the Bootstrap `index.ts` entry point file */
const ConfigFeatureFlagProvider: FunctionComponent = ({
  children,
  ...others
}) => {
  // make the query for the config
  const { loading, error, data, refetch } = useQuery(GET_CONFIG, {
    context: {
      purpose: 'config',
    },
  });
  const { client, featureFlags }: apolloQueryResponseType =
    data || defaultClientConfig;
  const value: ConfigFeatureFlagType = {
    client,
    featureFlags,
    loading,
    error: error ? true : false,
    isComplete: !(loading || error) && !loading && !error,
    triggerRefetch: () => {
      refetch();
    },
    rawResponse: error ? error : data ? data : {},
  };

  return (
    <ConfigFeatureFlag.Provider {...others} value={value}>
      {children}
    </ConfigFeatureFlag.Provider>
  );
};

export {
  ConfigFeatureFlagProvider,
  ConfigFeatureFlagConsumer,
  useConfigFeatureFlag,
  _ConfigFeatureFlag_TestProvider,
};
