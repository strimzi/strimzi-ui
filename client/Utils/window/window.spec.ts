/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { getLocation } from './window';

describe('window function tests', () => {
  describe(`getLocation`, () => {
    it('returns the location object from the window', () => {
      expect(getLocation()).toEqual(window.location);
    });
  });
});
