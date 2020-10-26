/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from 'react';
import { render } from '@testing-library/react';
import {ConfigFeatureFlagProvider, ConfigFeatureFlagConsumer}  from './Context';

describe('ConfigFeatureFlag context', () => {

  describe('initial state tests', () => {
    it('returns the expected configuration values', () => {
      const {getByText} = render(<ConfigFeatureFlagProvider>
        <ConfigFeatureFlagConsumer>
          {({config}) => {
            return <p>{JSON.stringify(config)}</p>;
          }}
        </ConfigFeatureFlagConsumer>
      </ConfigFeatureFlagProvider>);
      expect(getByText('{"example":{"value":true}}')).toBeInTheDocument();
    });
  
    it('returns the expected featureFlags values', () => {
      const {getByText} = render(<ConfigFeatureFlagProvider>
        <ConfigFeatureFlagConsumer>
          {({featureFlags}) => {
            return <p>{JSON.stringify(featureFlags)}</p>;
          }}
        </ConfigFeatureFlagConsumer>
      </ConfigFeatureFlagProvider>);
      expect(getByText('{"capability":{"enabled":false}}')).toBeInTheDocument();
    });

    it('returns the expected state values', () => {
      // check the internals of the context are provided to consumers
      render(<ConfigFeatureFlagProvider>
        <ConfigFeatureFlagConsumer>
          {({loading, error, isComplete, triggerRefetch}) => {
            expect(loading).toBe(false);
            expect(error).toBe(false);
            expect(isComplete).toBe(true);
            expect(triggerRefetch).toEqual(expect.any(Function));
            expect(triggerRefetch()).toBe(true);
            return <p>{JSON.stringify(isComplete)}</p>;
          }}
        </ConfigFeatureFlagConsumer>
      </ConfigFeatureFlagProvider>);
    });


  });

  





});