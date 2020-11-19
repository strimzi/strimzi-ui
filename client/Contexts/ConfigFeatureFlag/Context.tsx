/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { createContext, FunctionComponent } from 'react';
import set from 'lodash.set';
import merge from 'lodash.merge';
import { useQuery } from '@apollo/client';
import { GET_CONFIG } from 'Queries/Config';
import { sanatiseUrlParams, getLocation } from 'Utils';
import {
  defaultClientConfig,
  defaultConfigFeatureFlagValue,
} from './ConfigFeatureFlag.assets';

import {
  ApolloQueryResponseType,
  ConfigFeatureFlagType,
} from './ConfigFeatureFlag.types';
/** ConfigFeatureFlag context - exported solely for use in test and the `useConfigFeatureFlag` hook. Please use the hook or the exported provider/consumer components to access values at runtime */
const ConfigFeatureFlag = createContext(defaultConfigFeatureFlagValue);
/** ConfigFeatureFlagConsumer - consumer component of the ConfigFeatureFlag context */
const ConfigFeatureFlagConsumer = ConfigFeatureFlag.Consumer;
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

  // check to see if we have the raw bootstrap config element
  const rawBootstrapConfigElement = document.querySelector(
    'meta[name="bootstrapConfigs"]'
  );

  let bootstrapConfig;
  if (rawBootstrapConfigElement !== null) {
    const configElementContent = rawBootstrapConfigElement.getAttribute(
      'content'
    );
    bootstrapConfig =
      configElementContent !== null
        ? JSON.parse(decodeURIComponent(configElementContent))
        : defaultConfigFeatureFlagValue.bootstrapConfig;
  } else {
    bootstrapConfig = defaultConfigFeatureFlagValue.bootstrapConfig;
  }

  const { client, featureFlags }: ApolloQueryResponseType =
    data || defaultClientConfig;

  // check to see/merge any feature flag state with any defined in browser
  const sanatisedParams = sanatiseUrlParams(getLocation().search);
  const featureFlagsFromUrl = sanatisedParams.ff
    ? sanatisedParams.ff
      .split(',')
      .map((encodedKeyValuePair) => encodedKeyValuePair.split('='))
      .reduce((acc, [ffKey, value]) => {
        return set(acc, ffKey, value === 'true');
      }, {})
    : {};
  const featureFlagsWithUrlFlags = merge(
    merge({}, featureFlags),
    featureFlagsFromUrl
  );

  const value: ConfigFeatureFlagType = {
    client,
    featureFlags: featureFlagsWithUrlFlags,
    bootstrapConfig,
    loading,
    error: error ? true : false,
    isComplete: !loading && !error,
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
  ConfigFeatureFlag,
};
