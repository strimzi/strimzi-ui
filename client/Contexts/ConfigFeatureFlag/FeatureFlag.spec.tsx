/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { RenderResult } from '@testing-library/react';
import React from 'react';
import { renderWithCustomConfigFeatureFlagContext } from 'utils/test';
import { defaultClientConfig } from './ConfigFeatureFlag.assets';
import { FeatureFlag } from './FeatureFlag.view';

describe('FeatureFlag component', () => {
  const testConfigFeatureFlagState = {
    ...defaultClientConfig,
    featureFlags: {
      flag: {
        settingOne: true,
        settingTwo: false,
      },
    },
  };

  const renderForTestFFComponentWithFlag: (flag: string) => RenderResult = (
    flag
  ) =>
    renderWithCustomConfigFeatureFlagContext(
      testConfigFeatureFlagState,
      <FeatureFlag flag={flag}>My Feature</FeatureFlag>
    );

  it('renders a feature when the flag is enabled', () => {
    const { queryByText } = renderForTestFFComponentWithFlag('flag.settingOne');
    expect(queryByText('My Feature')).toBeInTheDocument();
  });

  it('does not render a feature when the flag is disabled', () => {
    const { queryByText } = renderForTestFFComponentWithFlag('flag.settingTwo');
    expect(queryByText('My Feature')).not.toBeInTheDocument();
  });

  it('does not render a feature when the flag is not found', () => {
    const { queryByText } = renderForTestFFComponentWithFlag('doesnt.exist');
    expect(queryByText('My Feature')).not.toBeInTheDocument();
  });
});
