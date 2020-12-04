/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { Given, When, Then, Fusion } from 'jest-cucumber-fusion';
import { RenderResult } from '@testing-library/react';
import merge from 'lodash.merge';
import { renderWithCustomConfigFeatureFlagContext } from 'utils/test';
import { Home } from '.';
import React, { ReactElement } from 'react';

let renderResult: RenderResult;
let component: ReactElement;
let showVersionSet: boolean;

const coreConfigFromContext = {
  client: { about: { version: '34.34.34' } },
  featureFlags: {
    client: {
      Home: {
        showVersion: true,
      },
    },
  },
};

Given('a Home component', () => {
  component = <Home />;
});

When('it is rendered', () => {
  renderResult = renderWithCustomConfigFeatureFlagContext(
    coreConfigFromContext,
    component
  );
  showVersionSet = true;
});

When('it is rendered with no version', () => {
  renderResult = renderWithCustomConfigFeatureFlagContext(
    merge({}, coreConfigFromContext, {
      featureFlags: {
        client: {
          Home: {
            showVersion: false,
          },
        },
      },
    }),
    component
  );
  showVersionSet = false;
});

Then('it should display the expected text', async () => {
  const { getByText, queryByText } = renderResult;
  expect(getByText('Welcome to the Strimzi UI')).toBeInTheDocument();
  const versionString = `Version: ${coreConfigFromContext.client.about.version}`;
  showVersionSet
    ? expect(getByText(versionString)).toBeInTheDocument()
    : expect(queryByText(versionString)).not.toBeInTheDocument();
});

Fusion('Home.feature');
