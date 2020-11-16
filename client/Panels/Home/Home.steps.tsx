/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { Given, When, Then, Fusion } from 'jest-cucumber-fusion';
import { RenderResult } from '@testing-library/react';
import { renderWithCustomConfigFeatureFlagContext } from 'utils/test';
import { Home } from '.';
import React, { ReactElement } from 'react';

let renderResult: RenderResult;
let component: ReactElement;

Given('a Home component', () => {
  component = <Home />;
});

When('it is rendered', () => {
  renderResult = renderWithCustomConfigFeatureFlagContext(
    {
      client: { about: { version: '34.34.34' } },
      featureFlags: {
        client: {
          Home: {
            showVersion: true,
          },
        },
      },
    },
    component
  );
});

Then('it should display text', () => {
  const { getByText } = renderResult;
  expect(getByText('Welcome to the Strimzi UI')).toBeInTheDocument();
  expect(getByText('Version: 34.34.34')).toBeInTheDocument();
});

Fusion('Home.feature');
