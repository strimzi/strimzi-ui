# Client

This directory contains all client code for the Strimzi UI - ie code which is sent to a user's browser. A summary of contents can be found below:

- [Bootstrap](./Bootstrap/README.md) - code and React components which are responsible for bootstrapping the UI
- [Contexts](./Contexts/README.md) - state management code
- [Elements](./Elements/README.md) - presentational React components
- [Groups](./Groups/README.md) - React components which are combine and compose `Element` components
- [Hooks](./Hooks/README.md) - custom reusable React Hooks
- [Images](./Images/README.md) - images used across the UI
- [Pages](./Pages/README.md) - metadata used to describe the pages shown in the UI
- [Panels](./Panels/README.md) - section/page level components
- [Queries](./Queries/README.md) - GraphQL request definitions (Queries, Mutations etc)
- [Utils](./Utils/README.md) - common utility code used across the client UI
- `tsconfig.json` - Typescript config for this codebase
- `jest.config.js` - Jest config for this codebase.

## Configuration options

The client codebase will include a significant number of configuration options, all of which [can be found here](../config/README.md). These values will be retrieved and made available via the [`ConfigFeatureFlag`](./Contexts/ConfigFeatureFlag/README.md) context at runtime, along with feature flag state.

The below table details the top level items, and what they contain:

| Configuration | Content                                                                     |
| ------------- | --------------------------------------------------------------------------- |
| about         | Key value pairs containing metadata about the UI - eg the version of the UI |
