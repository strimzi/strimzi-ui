/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { Then, Fusion } from "jest-cucumber-fusion";
import { stepWithWorld } from "test_common/commonServerSteps";

Then(
  "I get the expected config response",
  stepWithWorld((world) => {
    const { request } = world;
    return request.expect(200).expect((res) => {
      const { data } = res.body;
      expect(data).not.toBeUndefined();

      const { client, server, featureFlags } = data;

      // confirm for all three config types the generated type names are present - shows the schema generation and resolvers are working
      expect(client).not.toBeUndefined();
      expect(client._generatedTypeName).toBe("client");

      expect(server).not.toBeUndefined();
      expect(server._generatedTypeName).toBe("server");

      expect(featureFlags).not.toBeUndefined();
      expect(featureFlags._generatedTypeName).toBe("featureFlags");
    });
  })
);

Fusion("config.feature");
