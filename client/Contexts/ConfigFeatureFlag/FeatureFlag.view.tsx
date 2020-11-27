/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import get from 'lodash.get';
import { useConfigFeatureFlag } from 'Hooks';

type featureFlagPropsType = {
  /** the json path of the flag - eg `client.Home.showVersion` */
  flag: string;
};

export const FeatureFlag: FunctionComponent<featureFlagPropsType> = ({
  children,
  flag,
  ...others
}) => {
  const { featureFlags } = useConfigFeatureFlag();

  const featureFlagValue = get(featureFlags, flag, false);

  return (
    <div {...others} data-ff={flag}>
      {featureFlagValue ? children : null}
    </div>
  );
};
