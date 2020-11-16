/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { Provider, ReactElement, ReactNode } from 'react';
import { render, RenderResult } from '@testing-library/react';
import {
  ConfigFeatureFlag,
  defaultClientConfig,
  defaultConfigFeatureFlagValue,
} from 'Contexts';
import { apolloQueryResponseType } from 'Contexts/types';

type TestProviderWithValue<T> = {
  value: T;
  provider: Provider<T>;
};

const contextWrapper: <T>(
  providers: Array<TestProviderWithValue<T>>,
  children: ReactNode
) => JSX.Element = (providers = [], children = null) => (
  <React.Fragment>
    {providers.reduceRight(
      (accJsx, { provider: ProviderToMount, value }) => (
        <ProviderToMount value={value}>{accJsx}</ProviderToMount>
      ),
      children
    )}
  </React.Fragment>
);

const renderWithContextProviders: <T>(
  ui: ReactElement,
  options: Record<string, unknown>,
  providers: Array<TestProviderWithValue<T>>
) => RenderResult = (ui, options, providers) =>
  render(ui, {
    wrapper: ({ children }) => {
      return contextWrapper(providers, children);
    },
    ...options,
  });

/** withConfigFeatureFlagContext renders the given `ui` JSX with a ConfigFeatureFlag provider seeded with default values. Use this if your components indirectly use/require a value from the ConfigFeatureFlag context, else use `withCustomConfigFeatureFlagContext` so the value from ConfigFeatureFlag can be controlled  */
const withConfigFeatureFlagContext: (
  ui: ReactElement,
  options?: Record<string, unknown>
) => RenderResult = (ui, options = {}) =>
  renderWithContextProviders(ui, options, [
    {
      provider: ConfigFeatureFlag.Provider,
      value: defaultConfigFeatureFlagValue,
    },
  ]);

/** withCustomConfigFeatureFlagContext renders the given `ui` JSX with a ConfigFeatureFlag provider provided via `configFeatureFlagValue`. */
const withCustomConfigFeatureFlagContext: (
  configFeatureFlagValue: apolloQueryResponseType,
  ui: ReactElement,
  options?: Record<string, unknown>
) => RenderResult = (
  configFeatureFlagValue = defaultClientConfig,
  ui,
  options = {}
) =>
  renderWithContextProviders(ui, options, [
    {
      provider: ConfigFeatureFlag.Provider,
      value: { ...defaultConfigFeatureFlagValue, ...configFeatureFlagValue },
    },
  ]);

export {
  renderWithContextProviders,
  withConfigFeatureFlagContext,
  withCustomConfigFeatureFlagContext,
};
