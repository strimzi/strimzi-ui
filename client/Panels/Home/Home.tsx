/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import image from 'Images/logo.png';
import './style.scss';
import { useConfigFeatureFlag, FeatureFlag } from 'Contexts';

const Home: FunctionComponent = ({ children }) => {
  const { client, isComplete } = useConfigFeatureFlag();

  return (
    <div className='home'>
      <img src={image} alt='Strimzi logo' />
      Welcome to the Strimzi UI
      <FeatureFlag flag={'client.Home.showVersion'}>
        {isComplete && `Version: ${client.version}`}
      </FeatureFlag>
      {children}
    </div>
  );
};

export { Home };
