/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import get from 'lodash.get';
import image from 'Images/logo.png';
import './style.scss';
import { useConfigFeatureFlag, useLogger } from 'Hooks';
import { useTopics } from 'Models';

const Home: FunctionComponent = ({ children }) => {
  const { client, featureFlags, isComplete } = useConfigFeatureFlag();
  const version = get(client, 'about.version', '');
  // use the feature flag from context - could also use the `FeatureFlag` component - this just shows alternative usage
  const showVersion = get(featureFlags, 'client.Home.showVersion', false);

  const { debug } = useLogger('Home');
  debug(`Client version to display: ${version}`);

  const { useGetTopics } = useTopics();
  const { data, loading } = useGetTopics();

  return (
    <div className='home'>
      <img src={image} alt='Strimzi logo' />
      <p>Welcome to the Strimzi UI</p>
      {showVersion && isComplete && <p>{`Version: ${version}`}</p>}
      {loading || !data ? (
        <p>Loading...</p>
      ) : (
        <p>{`Number of topics: ${data.topics.length}`}</p>
      )}
      {children}
    </div>
  );
};

export { Home };
