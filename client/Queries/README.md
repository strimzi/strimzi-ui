# Queries

This directory is home to all GraphQL queries. These should be imported by the appropriate models and exposed via a hook.

## File Structure

- Queries
  - query set (e.g. topics)
    - index.ts - containing all gql queries for that set

## Examples

### API

```typescript
// topics/index.ts

import gql from 'graphql-tag';

export const GET_TOPICS = gql`
  query {
    ...
  }
`;

export const TOPIC_SUBSCRIPTION = gql`
  subscription {
    ...
  }
`;

export const CREATE_TOPIC = gql`
  mutation {
    ...
  }
`;
```

```typescript
// useTopic.hook.ts

import { CREATE_TOPIC, TOPIC_SUBSCRIPTION, GET_TOPICS } from '@/Queries/topics';
import { useMutation, useQuery, useSubscription } from '@apollo/client';

const useTopic = () => {
  const [createTopic, { data }] = useMutation(CREATE_TOPIC);
  const getTopics = () => useQuery(GET_TOPICS);
  const topicsSubscription = () =>
    useSubscription(TOPIC_SUBSCRIPTION, {}, true);
  return {
    addTopic,
    getTopics,
    topicsSubscription,
  };
};

export default useTopic;
```

```typescript
// topics.model.ts

import { useTopic } from '@/Hooks';

const TopicModel = () => {
  const { addTopic, getTopics, topicSubscription } = useTopic();

  // pass these as props to view
  const { loading, error, data } = getTopics();
  const { sub_loading, sub_error, sub_data } = topicsSubscription();
  ...
};
```

### Config

When fetching config, a context will need to be provided so that Apollo goes to the correct server.

```typescript
// config/index.ts

import gql from 'graphql-tag';

const GET_CONFIG = gql`
  query {
    ...
  }
`;
```

```typescript
// config.hook.ts

import { GET_CONFIG } from '@/Queries/topics';
import { useQuery } from '@apollo/client';

const useConfig = () => {
  const getConfig = () =>
    useQuery(GET_CONFIG, {
      context: {
        purpose: 'config',
      },
    });
  return getConfig;
};
```
