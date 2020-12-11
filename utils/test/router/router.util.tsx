/* eslint-disable @typescript-eslint/no-empty-function */
/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { NavigationState } from 'Bootstrap/Navigation/types';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (
  ui: React.ReactElement,
  { route = '/' } = {}
): RenderResult => {
  window.history.pushState({}, 'Test page', route);

  return render(ui, { wrapper: BrowserRouter });
};

const NavigationStatePlaceholder: NavigationState = {
  state: {
    path: {},
    query: {},
  },
  goBack: () => {},
  hasRoute: () => true,
  // eslint-disable-next-line react/display-name
  renderLinkTo: () => <div></div>,
  goTo: () => {},
};

export { renderWithRouter, NavigationStatePlaceholder };
