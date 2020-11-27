/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import merge from 'lodash.merge';
import { jsonToSchema } from '@walmartlabs/json-to-simple-graphql-schema/lib';
import { IResolvers } from 'apollo-server-express';
import { serverConfigType } from 'types';
import { featureFlags, client, server } from 'ui-config/index';

type configSchemaResolverType = {
  typeDefs: string;
  resolvers: IResolvers;
};

export const apolloConfig: (
  config: serverConfigType
) => configSchemaResolverType = (config) => {
  const {
    featureFlags: featureFlagOverrides,
    client: { configOverrides },
  } = config;

  const configToHost = {
    featureFlags: merge({}, featureFlags.publicValues, featureFlagOverrides),
    client: merge({}, client.publicValues, configOverrides),
    server: server.publicValues,
  };

  const { query, schemaTypes, resolvers } = Object.entries(configToHost)
    .map(([key, config]) => ({
      type: key,
      typeValue: { _generatedTypeName: key, ...config },
    }))
    .reduce(
      ({ schemaTypes, resolvers }, { type, typeValue }) => {
        const { value } = jsonToSchema({
          baseType: type,
          jsonInput: JSON.stringify(typeValue),
        });
        const allResolvers = { ...resolvers.Query, [type]: () => typeValue };

        return {
          schemaTypes: schemaTypes.concat([value]),
          resolvers: {
            Query: {
              ...allResolvers,
            },
          },
          query: `type Query { ${Object.keys(allResolvers).reduce(
            (acc, key) => `${acc}${key}: ${key} `,
            ''
          )}} `,
        };
      },
      {
        query: ``,
        schemaTypes: [] as Array<string>,
        resolvers: { Query: {} },
      }
    );

  const typeDefs = `${query}${schemaTypes.join(' ')}`;
  return { typeDefs, resolvers };
};
