/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import { renderHook } from '@testing-library/react-hooks';
import { useConfigFeatureFlag } from './useConfigFeatureFlag';
import { defaultConfigFeatureFlagValue } from 'Contexts';

describe('`useConfigFeatureFlag` hook', () => {
  // The functions/responses/behaviours of the hook are the same as the components, tested in `client/Contexts/ConfigFeatureFlag/ConfigFeatureFlag.spec.tsx`. This test verifies the hook returns the expected state
  it('returns the expected context state', () => {
    const { result } = renderHook(() => useConfigFeatureFlag());
    const hookValue = result.current;
    expect(hookValue).toEqual(defaultConfigFeatureFlagValue);
  });
});
