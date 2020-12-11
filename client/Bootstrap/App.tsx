/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import { useRouteConfig } from './Navigation/useRouteConfig/useRouteConfig.hook';
import * as pages from 'Pages';
import { NavigationWrapper } from './Navigation';
import { BrowserRouter } from 'react-router-dom';

const App: FunctionComponent = () => {
  const RouterConfig = useRouteConfig(pages);

  return (
    <BrowserRouter>
      <NavigationWrapper configuration={RouterConfig} />
    </BrowserRouter>
  );
};

export { App };
