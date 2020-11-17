/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import { render, RenderResult } from '@testing-library/react';

const renderHookWithWrapper = <T,>(
  Wrapper: FunctionComponent,
  hook: () => T,
  callback: (result: T) => void
): RenderResult => {
  const HookWrapper: FunctionComponent = () => {
    const result = hook();

    callback(result);
    return <div />;
  };

  return render(
    <Wrapper>
      <HookWrapper />
    </Wrapper>
  );
};

export { renderHookWithWrapper };
