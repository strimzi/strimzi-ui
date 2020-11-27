/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { sanitiseUrlParams } from './sanitise';

describe('sanitise function tests', () => {
  describe(`sanitiseUrlParams`, () => {
    [
      {
        input: '',
        output: {},
      },
      {
        input: 'orphan',
        output: { orphan: '' },
      },
      {
        input: 'name=harry',
        output: { name: 'harry' },
      },
      {
        input: 'evil.<key>=invalid',
        output: {},
      },
      {
        input: 'evil>=inva<evil>lid',
        output: {},
      },
      {
        input: 'evil>=inva<evil>lid&name=harry',
        output: { name: 'harry' },
      },
    ].forEach(({ input, output }) =>
      it(`returns the expected response (${JSON.stringify(
        output
      )}) for given parameters '${input}'`, () => {
        expect(sanitiseUrlParams(input)).toEqual(output);
      })
    );
  });
});
