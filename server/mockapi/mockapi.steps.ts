/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { Then, Fusion } from 'jest-cucumber-fusion';
import { stepWithWorld } from 'test_common/commonServerSteps';

Then(
  'I get the expected mockapi response',
  stepWithWorld((world) => {
    const { request } = world;
    return request.expect(200).expect((res) => {
      const { data } = res.body;

      expect(data).not.toBeUndefined();

      const { topics } = data;

      expect(topics).not.toBeUndefined();

      expect(Array.isArray(topics)).toBe(true);
      expect(topics.length).not.toBeLessThan(1);

      const { name, partitions, replicas } = topics[0];

      expect(name).not.toBeUndefined();
      expect(partitions).not.toBeUndefined();
      expect(replicas).not.toBeUndefined();
    });
  })
);

Then(
  'I get the expected mockapi test endpoint response',
  stepWithWorld((world) => {
    const { request } = world;
    return request.expect(418);
  })
);

Fusion('mockapi.feature');
