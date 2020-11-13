/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

/**
 * Mock requests used to test the gql elements of the server. Query names referenced in feature files, E.g `When I make a 'mockTopicsQuery' gql request to ...`. These can be generated using GraphiQL and it's export feature
 */
const mockTopicsQuery = {
  query: '{\n  topics {\n    name\n    partitions\n    replicas\n  }\n}\n',
};

const getConfigAndFeatureFlagQuery = {
  query:
    '\n{\n  featureFlags {\n    _generatedTypeName\n  }\n  client {\n    _generatedTypeName\n  }\n  server {\n    _generatedTypeName\n  }\n}',
};

const getConfigAndFeatureFlagQueryWithConfigOverrides = {
  query:
    '{\n  server {\n    _generatedTypeName\n  }\n  featureFlags {\n    client {\n      Home {\n        showVersion\n      }\n    }\n    testFlag\n  }\n\tclient {\n    version\n  }\n}\n',
};

export const requests = {
  mockTopicsQuery,
  getConfigAndFeatureFlagQuery,
  getConfigAndFeatureFlagQueryWithConfigOverrides,
};
