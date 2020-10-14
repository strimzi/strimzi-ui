/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React from 'react';
import { render } from '@testing-library/react';

const contextWrapper = (providers, children) => {
  let provider = providers.shift();
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
};

const renderWithContextProviders = (ui, options, providers) =>
  render(ui, {
    wrapper: ({ children }) => contextWrapper(providers, children),
    ...options,
  });

export { renderWithContextProviders };
