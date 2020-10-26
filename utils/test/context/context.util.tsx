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
) => JSX.Element = (providers, children) => {
  const { provider: ProviderToMount, value } = providers.shift();
  if (ProviderToMount) {
    if (providers.length === 0) {
      return <ProviderToMount value={value}>{children}</ProviderToMount>;
    } else {
      return (
        <ProviderToMount value={value}>
          {contextWrapper(providers, children)}
        </ProviderToMount>
      );
    }
  } else {
    throw new Error(
      'Provider array is empty. Please provide at least one provider'
    );
  }
};

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
