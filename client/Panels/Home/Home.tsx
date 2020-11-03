/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import image from 'Images/logo.png';

const Home: FunctionComponent = ({ children }) => {
  return (
    <div>
      <img src={image} alt='Strimzi logo' />
      Welcome to the Strimzi UI
      {children}
    </div>
  );
};

export { Home };
