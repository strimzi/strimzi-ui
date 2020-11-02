/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import {
  IntrospectionSchema,
  IntrospectionType,
  IntrospectionTypeRef,
} from 'graphql';
import {
  Entities,
  Entity,
  Expectations,
  OperationCallback,
} from './ExpectationTypes';
import keyBy from 'lodash.keyby';
import fromEntries from 'fromentries';

/**
 * Transforms a field from an object representation to a GraphQL schema string representation
 * @param type the type to transform
 * @return the GraphQL schema string
 */
const transformFieldType = (type: IntrospectionTypeRef) => {
  if (type.kind === 'LIST') {
    return `[${transformFieldType(type.ofType)}]`;
  } else if (type.kind === 'NON_NULL') {
    return `${transformFieldType(type.ofType)}!`;
  } else if (
    type.kind === 'SCALAR' ||
    type.kind === 'OBJECT' ||
    type.kind === 'ENUM'
  ) {
    return type.name;
  } else {
    throw new Error(`Unsupported graphql kind ${type.kind} for ${type.name}`);
  }
};

/**
 * Converts an array into an object; for each element of the array, use the prop identified by propName as the key
 * @param array The array to convert
 * @param propName The prop name to use as the keys for the new object
 * @return The object
 * @throws Error If the array contains more than one element that has the same value for propName
 * @throws Error If the key propName is not of type string in the array
 */
const indexBy = <T>(array: readonly T[], propName: string) => {
  return keyBy(array, (thing) => {
    const prop = thing[propName];
    if (typeof prop !== 'string') {
      throw new Error(
        `key identified by ${propName} must be of type string`
      );
    }
    return prop;
  });
};

/**
 * Indexes a type on an introspection schema using the named type ref, using already indexed types
 *
 * @param types The Types that exist on the schema
 * @param schema The schema to index
 * @param namedTypeRefKey The named type reference to use for indexing
 * @param propName The prop name to use as the key
 * @return the fields of the type identified by thing, indexed using by
 * @throws Error If the types does not contain a type for the namedTypeRefKey
 * @throws Error If the array contains more than one element that has the same value for by
 * @throws Error If the key by is not of type string in the type identified by the namedTypeRefKey
 */
const indexTypeFromSchema = (
  types: { [key: string]: IntrospectionType },
  schema: IntrospectionSchema,
  namedTypeRefKey: string,
  propName: string
) => {
  const namedTypeRef = schema[namedTypeRefKey];
  if (!namedTypeRef || !namedTypeRef.name) {
    return {};
  }
  const type = types[namedTypeRef.name];
  if (type === undefined) {
    throw new Error(`Unable to find a type for ${namedTypeRef.name}`);
  }
  if (type.kind !== 'OBJECT') {
    return {};
  }
  return indexBy(type.fields, propName);
};

/**
 * Introspect a schema and compare it to some expectations
 * @param Expectations the expectations to compare to
 * @param Schema the schema to introspect
 * @return The entities available according to the schema
 * @throws Error If parsing the schema fails
 *
 */
export const introspect = (
  expectations: Expectations,
  schema: IntrospectionSchema
): Entities => {
  // index the types by name
  const types = indexBy(schema.types, 'name');
  return fromEntries(
    Object.entries(expectations).map(([entityName, metadata]) => {
      const answer = {
        fields: {},
        operations: {},
        subscriptions: {},
        type: metadata.type,
      } as Entity;
      // For each expectation, locate it in the schema
      const type = types[metadata.type];
      if (type === undefined) {
        throw new Error(`Unable to find a type for ${metadata.type}`);
      }
      if (type.kind === 'OBJECT') {
        // index the fields by name
        const fields = indexBy(type.fields, 'name');
        // Then build the fields
        if (metadata.fields) {
          answer.fields = fromEntries(
            Object.entries(metadata.fields).map(([name, fieldType]) => {
              // find the field on the type
              const field = transformFieldType(fields[name].type);

              return [name, field === fieldType];
            })
          );
        }
      }
      if (metadata.operations) {
        // find the queries and mutations schemas & index by name
        const queries = indexTypeFromSchema(types, schema, 'queryType', 'name');
        const mutations = indexTypeFromSchema(
          types,
          schema,
          'mutationType',
          'name'
        );
        answer.operations = fromEntries(
          Object.entries(metadata.operations).map(
            ([name, callback]: [string, OperationCallback]) => {
              const answer = callback({
                queries: queries,
                mutations: mutations,
              });
              return [name, answer];
            }
          )
        );
      }

      if (metadata.subscriptions) {
        // find the subscription schemas & index by name
        const subscriptions = indexTypeFromSchema(
          types,
          schema,
          'subscriptionType',
          'name'
        );

        // Then build the subscriptions
        answer.subscriptions = fromEntries(
          Object.entries(metadata.subscriptions).map(([name, callback]) => [
            name,
            callback({ subscriptions: subscriptions }),
          ])
        );
      }

      return [entityName, answer];
    })
  );
};
