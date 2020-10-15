/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { Provider, ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';

type ProviderEntry = {
  value: any;
  provider: Provider<any>;
};

const contextWrapper = (
  providers: Array<ProviderEntry>,
  children: ReactNode
) => {
  let provider = providers.shift();
  if (provider) {
    if (providers.length == 0) {
      return (
        <provider.provider value={provider.value}>{children}</provider.provider>
      );
    } else {
      return (
        <provider.provider value={provider.value}>
          {contextWrapper(providers, children)}
        </provider.provider>
      );
    }
  } else {
    throw new Error(
      'Provider array is empty. Please provide at least one provider'
    );
  }
};

const renderWithContextProviders = (
  ui: ReactElement,
  options: Object,
  providers: Array<ProviderEntry>
) =>
  render(ui, {
    wrapper: ({ children }) => contextWrapper(providers, children),
    ...options,
  });

export { renderWithContextProviders };
