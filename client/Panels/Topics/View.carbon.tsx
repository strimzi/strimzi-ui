/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent, useState } from 'react';
import { useTopicsModel } from './Model';

/**
 * Placeholder Topics panel FC.
 */
const Topics: FunctionComponent = ({ children }) => {
  const [filter, setFilter] = useState<string | undefined>();
  const { useGetTopics } = useTopicsModel();
  const { data } = useGetTopics(filter);

  let topics: JSX.Element;
  if (data) {
    topics = <p>{`Topics retrieved: ${JSON.stringify(data)}`}</p>;
  } else {
    topics = <p>Loading...</p>;
  }

  return (
    <div className='topics'>
      <input placeholder='filter' onChange={(e) => setFilter(e.target.value)} />
      {topics}
      {children}
    </div>
  );
};

export { Topics };
