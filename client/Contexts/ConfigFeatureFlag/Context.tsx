/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { createContext, FunctionComponent, useState } from 'react';

// Temporary config/feature flag definition - to be filled out in later PR with server calls. Add values here and in `strimzi-ui/config` directory
const config = { example: { value: true } };
const featureFlags = { capability: { enabled: false } };

// Loading/Error/Trigger Refetch etc
const contextStates = {
  loading: false,
  error: false,
  isComplete: true,
  triggerRefetch: () => true,
};

const ConfigFeatureFlag = createContext({
  config: {},
  featureFlags: {},
  ...contextStates,
});
const ConfigFeatureFlagConsumer = ConfigFeatureFlag.Consumer;
const ConfigFeatureFlagProvider: FunctionComponent = ({
  children,
  ...others
}) => {
  // get the retrieved config
  const [configInState] = useState({ config, featureFlags });

  return (
    <ConfigFeatureFlag.Provider
      {...others}
      value={{ ...configInState, ...contextStates }}
    >
      {children}
    </ConfigFeatureFlag.Provider>
  );
};

export { ConfigFeatureFlagProvider, ConfigFeatureFlagConsumer };
