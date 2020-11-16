/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import {
  ConfigFeatureFlagType,
  apolloQueryResponseType,
} from './ConfigFeatureFlag.types';

export const defaultClientConfig: apolloQueryResponseType = {
  client: {},
  featureFlags: {},
};

/** default values/schema for this context */
export const defaultConfigFeatureFlagValue: ConfigFeatureFlagType = {
  ...defaultClientConfig,
  loading: false,
  error: false,
  isComplete: true,
  rawResponse: {},
  // ignore for code coverage - exists to provide the shape defined by ConfigFeatureFlagType
  triggerRefetch: /* istanbul ignore next */ () => {
    // NO-OP - placeholder
  },
};
