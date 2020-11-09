/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { Provider, ReactElement, ReactNode } from 'react';
import { render, RenderResult } from '@testing-library/react';

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

export { renderWithContextProviders };
