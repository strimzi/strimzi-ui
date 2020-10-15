/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
/* eslint-disable react/jsx-key */
import { Given, When, Then, Fusion } from 'jest-cucumber-fusion';
import { render, RenderResult } from '@testing-library/react';
import { translate, translateWithFormatting } from 'utils/test/i18n';
import { Home } from '.';
import React, { ReactElement } from 'react';

let renderResult: RenderResult;
let component: ReactElement;

Given('a Home component', () => {
  component = <Home />;
});

When('it is rendered', () => {
  renderResult = render(component);
});

Then('it should display text', () => {
  const { getByText } = renderResult;
  expect(getByText(translate('home.basic'))).toBeInTheDocument();
  expect(
    getByText(translate('home.insert', { insert: 'inserted value' }))
  ).toBeInTheDocument();
  expect(getByText(translate('home.formatted'))).toBeInTheDocument();
  expect(
    getByText(
      translateWithFormatting('home.formattedInsert', [
        {
          insert: 'inserted value',
        },
        { another: 'test' },
      ])
    )
  ).toBeInTheDocument();
  expect(
    getByText(
      translateWithFormatting('home.customInserts', [
        <div className='x' />,
        <strong />,
        <i />,
        <a title={translate('link')} href='http://google.com' />,
        {
          insert: 'inserted value',
        },
      ])
    )
  ).toBeInTheDocument();
});

Fusion('Home.feature');
