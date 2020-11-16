/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { useContext } from 'react';
import { ConfigFeatureFlag } from 'Contexts';
import { ConfigFeatureFlagType } from 'Contexts/types';

/** useConfigFeatureFlag - hook which returns the current value of the ConfigFeatureFlag context */
export const useConfigFeatureFlag: () => ConfigFeatureFlagType = () =>
  useContext(ConfigFeatureFlag);
