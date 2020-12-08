/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import { TopLevelNavigationProps } from './TopLevelNavigation.types';

// temporary carbon view component to show navigation
const TopLevelNavigation: FunctionComponent<TopLevelNavigationProps> = ({
  links,
}: TopLevelNavigationProps) => {
  const nav = links.reduce(
    (acc, link) => [...acc, <li key={link.key}>{link}</li>],
    [] as JSX.Element[]
  );
  return <ul>{nav}</ul>;
};

export { TopLevelNavigation };
