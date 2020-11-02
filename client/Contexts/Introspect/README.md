# Introspect

This context will fetch the Strimzi admin GraphQL Schema, [perform introspection](https://graphql.org/learn/introspection/) upon it, and reduce the available capability into a UI friendly format. This state will be stored in context and available via Context consumer, but will also be accessible by hook (via `useContext`). This introspection will check the [expected](#expected-capability-schema) capabilities against what has been retrieved from Strimzi admin, resulting in [a shape which can be used across the UI](#returned-schema).

## Expected capability schema

A GraphQL schema is made up of `queries`, `types`, `mutations` and `subscriptions`. Together they describe what the server hosts and is capable of, but introspection is required to understand the relationship between these constructs, and what `mutation` for example will update a particular `type`.

To drive this introspection process, the Strimzi ui defines what it requires/expects to operate at an entity level. This approach will define what GraphQL `types` are expected, the fields those types should contain (and what types they are), the operations (`mutations`) that can be performed on a given `type`, and what `subscriptions` are available for a given type as well. Using the example of a Topic, this would look as follows:

```
{
    Topic: {
        type: 'Topic', // the GraphQL type name
        fields: {
            name: GQL_STRING, // the expected GraphQL type - could be string or object - which is checked if is available and thus query-able
            partitions: GQL_STRING,
            replicas: GQL_STRING
        },
        operations: {
            create: () => ..., // function that checks for a named mutation which provides the ability to create a topic for example
            update: () => ...,
            delete: () => ...,
        },
        subscriptions: {
            topicsUpdate: () => ... // function that checks for a named subscription which relates to topics
        }
    },
    ...
}
```

These shapes are iterated on vs the returned schema, which will result in the [returned schema described below.](#returned-schema)

## Returned schema

Following introspection, the returned result to consumers will be as follows:

```
{
    entities: {
        Topic: {
            type: 'Topic',
            fields: {
                name: true,
                partitions: false,
                replicas: false,
            },
            operations: {
                create: true,
                update: false,
                delete: false,
            },
            subscriptions: {
                topicsUpdate: false
            }
        },
        ... others ...
    },
    isLoading: false,
    isError: false,
    isComplete: true,
    response: {
        ... full GraphQL response ...
    }
}
```

Given this context involves data fetching, not only will the result of the introspection be returned, but also will status information for consumers to make use of if needed.

The result of the introspection is a mapping of the expected fields, operation and subscriptions to `true` and `false`, based on if the expected capability is present by name and or type. Users of the Context/Hook to easily check if a capability is available as follows:

```
const { Topic } = entities;
...
const  canCreate =  Topic.operations.create;
```
