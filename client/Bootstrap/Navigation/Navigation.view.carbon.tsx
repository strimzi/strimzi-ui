/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import { TopLevelNavigation } from 'Groups';

type NavigationProps = {
  showTopLevelNav: boolean;
  topLevelLinks: JSX.Element[];
  showSecondLevelNav: boolean;
  secondLevelLinks: JSX.Element[];
};

const Navigation: FunctionComponent<NavigationProps> = ({
  children,
  showTopLevelNav,
  topLevelLinks,
  showSecondLevelNav,
  secondLevelLinks,
}) => {
  return (
    <>
      {showTopLevelNav && <TopLevelNavigation links={topLevelLinks} />}
      {showSecondLevelNav && <TopLevelNavigation links={secondLevelLinks} />}
      {children}
    </>
  );
};

export { Navigation };
