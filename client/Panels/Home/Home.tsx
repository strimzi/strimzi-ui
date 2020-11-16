/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import get from 'lodash.get';
import image from 'Images/logo.png';
import './style.scss';
import { useConfigFeatureFlag } from 'Hooks';

const Home: FunctionComponent = ({ children }) => {
  const { client, featureFlags, isComplete } = useConfigFeatureFlag();
  const version = get(client, 'about.version', '');
  // use the feature flag from context - could also use the `FeatureFlag` component - this just shows alternative usage
  const showVersion = get(featureFlags, 'client.Home.showVersion', false);

  return (
    <div className='home'>
      <img src={image} alt='Strimzi logo' />
      Welcome to the Strimzi UI
      {showVersion && isComplete && `Version: ${version}`}
      {children}
    </div>
  );
};

export { Home };
