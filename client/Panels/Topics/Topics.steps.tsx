/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import {
  And,
  Given,
  When,
  Then,
  Fusion,
  Before,
  After,
} from 'jest-cucumber-fusion';
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import { Topics } from '.';
import React, { ReactElement } from 'react';
import { withApolloProviderReturning } from 'utils/test';
import {
  mockGetTopicsRequests,
  mockGetTopicsResponses,
} from './useTopicsModel.assets';

let renderResult: RenderResult;
let component: ReactElement;

Before(() => {
  jest.useFakeTimers();
});

After(() => {
  jest.useRealTimers();
});

Given('a Topics panel component', () => {
  component = <Topics />;
});

When('it is rendered', () => {
  renderResult = render(
    withApolloProviderReturning(
      [
        mockGetTopicsRequests.successRequest,
        mockGetTopicsRequests.successFilteredRequest,
      ],
      component
    )
  );
  jest.runAllTimers();
});

And(/^I filter for topic '(.+)'$/, async (filter) => {
  fireEvent.change(renderResult.getByPlaceholderText('filter'), {
    target: { value: filter },
  });
  await waitFor(() => {
    jest.runAllTimers();
  });
});

Then('I see all topics', async () => {
  const { findByText } = renderResult;
  expect(
    await findByText(JSON.stringify(mockGetTopicsResponses.successResponse), {
      exact: false,
    })
  ).toBeInTheDocument();
});

Then(/^I see topic '(.+)' in the topic list$/, async (topicName) => {
  const { findByText } = renderResult;
  expect(
    await findByText(
      JSON.stringify(mockGetTopicsResponses.successFilteredResponse),
      { exact: false }
    )
  ).toBeInTheDocument();
  expect(
    await findByText(topicName as string, { exact: false })
  ).toBeInTheDocument();
});

Fusion('Topics.feature');
