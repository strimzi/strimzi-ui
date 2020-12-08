/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { PageType, Page } from 'Bootstrap/Navigation/types';
import { Home } from 'Panels/Home';

export const HomePage: Page = {
  contentComponent: Home,
  contexts: [
    {
      path: '/',
      name: 'HOME',
      feature_flag: 'Pages.PlaceholderHome',
      order: 0,
      icon: 'myIcon.svg',
      pageType: PageType.NORMAL,
      requiresMinimum: {},
    },
  ],
};
