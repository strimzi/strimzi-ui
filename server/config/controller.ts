/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import { jsonToSchema } from '@walmartlabs/json-to-simple-graphql-schema/lib';
import { featureFlags, client, server } from 'ui-config';

// iterate through the various imported config items, including only items which are not sensitive
const configToHost = {
  featureFlags: featureFlags.publicValues,
  client: client.publicValues,
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

const schema = `${query}${schemaTypes.join(' ')}`;
export { schema, resolvers };
