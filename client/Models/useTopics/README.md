# useTopics

The `useTopics` hook returns sub-hooks to administer Kafka topics via GraphQL queries to the server `/api` endpoint. The sub-hooks returned by the `useTopics` hook are:

- `useGetTopics()` - returns the list of topics, including name, partitions count and replicas count, as an [Apollo `QueryResult` object](https://www.apollographql.com/docs/react/api/react/hooks/#result).
