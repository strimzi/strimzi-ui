/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import ReactDOM from 'react-dom';
import React from 'react';
import { init } from 'i18n';
import { ApolloProvider } from '@apollo/client';

import { apolloClient } from 'Bootstrap/GraphQLClient';
import { ConfigFeatureFlagProvider, FeatureFlag } from 'Contexts';
import { Home } from 'Panels/Home';
import { LoggingProvider } from 'Contexts';

init(); //Bootstrap i18next support
ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <ConfigFeatureFlagProvider>
      <LoggingProvider>
        <FeatureFlag flag={'client.Pages.PlaceholderHome'}>
          <Home />
        </FeatureFlag>
      </LoggingProvider>,
    </ConfigFeatureFlagProvider>
  </ApolloProvider>,
  document.getElementById('root')
);
