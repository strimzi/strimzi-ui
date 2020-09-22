# Architecture

This document will cover the core Architectural decisions made for this UI, how aspects of the UI integrate together and work, as well as detail how the UI then integrates with a Strimzi deployment.

## Contents

- [Overview and objectives](#overview-and-objectives)
- [Security](#security)
- [Topology](#topology)
  - [Production](#production-topology)
  - [Development and test](#development-and-test-topology)
- [Transport layer](#transport-layer)
- [Strimzi integration](#strimzi-integration)
- [Implementation details](#implementation-details)
  - [Front end (client)](#client)
    - [Technologies and patterns used](#technologies-and-patterns-used)
    - [File name conventions](#file-name-conventions)
    - [Routing and navigation model](#routing-and-navigation)
    - [GraphQL Introspection](#introspection)
    - [Component topology](#component-topology)
  - [Back end (server)](#server)
  - [Entity model](#entity-model)
  - [Configuration and feature flagging](#configuration-and-feature-flagging)
- [Code structure](#code-structure)
  - [Directory structure](#directory-structure)
  - [`Element`, `Group`, `Panel`, `Bootstrap` component pattern](#element-group-panel-bootstrap-component-pattern)
  - [Swap-able view layers](#swap-able-view-layers)
- [Supporting utilities and tools](#supporting-utilities-and-tools)
  - [Storybook](#storybook)
  - [Mock admin server](#mock-admin-server)

### Overview and objectives

The purpose of this UI is to provide a user of Strimzi a web UI for Kafka administration. To achieve this, focus of course needs to be placed on things like the design to make the UI intuitive to use. However, user experience is more than just the design: it also is the code, and it's ability to enable those experiences. The following documentation will detail the deliberate design, engineering and behavioural choices made to achieve this objective.

In addition, we have set the following behaviours/goals/considerations for all development done in this repository:

- Focusing on the user, be they developer or end user, at all times
- To make the codebase as approachable as possible through the use of consistent and intuitive style, and supporting documentation
- To make the codebase extensible and configurable
- Adopting a cloud like CI/CD development model: lots of small and often changes, appropriately flagged, with the `master` branch being shippable at any time
- Use automation as much as possible to maintain a CI/CD model - things like automated dependency updates, issue management etc

### Security

The UI will include a (configurable - including off) security model, which will map authenticated users to roles (with authorizations associated), and thus reflect in what they can access and do in the UI itself.

Further details will be added to this section once https://github.com/strimzi/proposals/pull/13, https://github.com/strimzi/proposals/pull/6 and https://github.com/strimzi/proposals/pull/9 have been finalized.

### Topology

The following section will detail how the UI in this repository integrates with related/supporting components when deployed in production, but also at development and test time. A client side [component topology can be found here.](#component-topology)

#### Production topology

_Further details will be added to this section once https://github.com/strimzi/proposals/pull/6 has been finalized._

_Proposal_: The UI when deployed as a part of Strimzi could look as follows:

![Production topology](./assets/ProductionTopology.png)

Where:

- The UI deployment hosts the UI server
- The UI deployment is configured to reference an instance of Strimzi admin deployed to serve UI backend requests
- The UI server hosts the built UI and public assets, and serves these to clients
- The UI server integrates and enforces (if configured) Authentication and Authorization checks, as well as user session management
- The UI server proxies requests to the configured Strimzi admin deployment

The responsibility of the UI server is to validate and handle client requests, and to abstract the backend from the client. As mentioned, this validation could range from authentication challenges, to validating proper use of HTTP headers. Abstracting the backend enables flexibility in deployment, and could enable use cases where one UI interacts with many instances of Strimzi admin.

#### Development and test topology

When run under development or end to end test scenarios, the UI topology is as similar as possible to a production deployment as possible. However, there are a few differences, as shown in the below diagram(s):

![Development topology using a real backend](./assets/DevelopmentTopologyUsingRealStrimziAdmin.png)
![Development topology using mock backend](./assets/DevelopmentTopology.png)

In both cases, `webpack-dev-server` hosts the development UI (rather than the UI Server), and proxies any requests it does not recognise to the instance of the UI server. The UI server then operates as it would in a normal production deployment. As shown in the diagram, the UI server could then be configured to send backend requests to either a 'real' Strimzi admin instance, or [a mock version of Strimzi admin to enable local development.](#mock-admin-server). In the case of end to end testing, this mock backend will be used, so deterministic behaviour can be guaranteed during the test.

![End to end test topology](./assets/EndToEndTopology.png)

Further details will be added to this section once https://github.com/strimzi/proposals/pull/6 has been finalized.

### Transport layer

Further details will be added to this section once https://github.com/strimzi/proposals/pull/6 and https://github.com/strimzi/proposals/pull/9 have been finalized.

### Strimzi integration

This will be completed once https://github.com/strimzi/proposals/pull/6 has been finalized.

### Implementation details

This section will detail implementation and design choices made for both the [client](#client) and the [server](#server) for this UI. The [entity model](#entity-model) and [configuration/feature flagging](#configuration-and-feature-flagging) sections apply to both [client](#client) and [server](#server).

#### Client

This section will detail the high level design choices made when designing and implementing this UI.

##### Technologies and patterns used

A modern UI is made up of and enabled by many different technologies and implementation patterns. This section will detail what tools have been used to implement this UI, with a brief rationale to why.

This UI makes use of:

- The [Model View Controller (MVC)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) design pattern: this pattern encourages the separation of business, rendering and (flow of) control logic. This fits naturally with UI implementations, where rendering, dealing with user action and modification of state are all separate concerns.
- [React](https://reactjs.org/) to implement the UI, due to it's declarative and composable approach to implementing UIs. In particular, we will leverage:
  - Functional React components: enforces a functional style to component writing, and avoid common pitfalls of class based component implementations - such as misuse of lifecycle methods
  - React Context: to provide state management/access
  - React Hooks: to enable shareable common logic across components
  - React Lazy and Suspense: to enable asynchronous loading of component code where required
- [Sass](https://sass-lang.com/) for styling. This adds a number of helpful features on top of the core css language to commonise and speed up style implementation
- Webpack and Babel for building, bundling, treeshaking and transpiling the UI, and enabling day to day development. See [the build documentation](./Build.md#ui-build) for further details on build choices and setup.
- [`Barrel files`](https://basarat.gitbook.io/typescript/main-1/barrel) and named exports. Barrel files (when combined with [Webpack aliases](./Build.md#webpack-aliases)) allow for many components/modules/functions/constants which are related to be imported and used via one import statement. This relies on exported components/modules/functions/constants to be individually named so they can be imported directly.
- [`React Router`](https://github.com/ReactTraining/react-router) for it's declarative routing capabilities.

##### File name conventions

As mentioned above, the Strimzi-ui, inspired by the MVC pattern, separates business logic from rendering logic. This means a component's logic will be split across multiple files. In addition, for capabilities such as [Swap-able view layers](#swap-able-view-layers) to work, file names need to be known and consistent. Thus, a set of file name conventions should be followed to not only enable these capabilities, but also to standardise and make the codebase more approachable.

| Filename                                     | Contains/used for                                                                                                                                                                                                     | Alias (if available) |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `index.js`                                   | Barrel file. Used to export modules/components/functions.                                                                                                                                                             |                      |
| `View.<suffix>.js` / `View.js`               | Contains React component rendering logic. This can have a view layer suffix if different view layer implementations are required [(see table for details)](#swap-able-view-layers). Should be a functional component. | View                 |
| `Styling.<suffix>.(s)css` / `Styling.(s)css` | Styling code. This can have a view layer suffix if different view layer implementations are required [(see table for details)](#swap-able-view-layers).                                                               | Styling              |
| `Model.js`                                   | Business logic, implemented as a React Hook.                                                                                                                                                                          | Model                |
| `Context.js`                                 | React Context component implementation. See the [Contexts](../client/Contexts/README.md) for details.                                                                                                                 | Contexts             |
| `Hook.js`                                    | React custom hook implementation. See the [Hooks](../client/Hooks/README.md) for details.                                                                                                                             | Hooks                |
| `<name>.feature`                             | Feature (spec) file for this component. Used to describe the behaviours of the component in user stories/goals.                                                                                                       |                      |
| `<name>.steps.js`                            | Test file used to implement the `<name>.feature` file.                                                                                                                                                                |                      |
| `<name>.spec.js`                             | (Unit) test file for component/utility it sits in.                                                                                                                                                                    |                      |
| `<name>.stories.js`                          | [Storybook](#storybook) story implementation. Required for all components.                                                                                                                                            |                      |
| `<name>.assets.js`                           | Common utility code - for use in tests, storybook. Can also define (and have as a part of the exported content) constant values.                                                                                      |                      |
| `<name>.page.js`                             | Page metadata module. Should only be present in the `Client/Pages` directory. See [here for more details](../client/Pages/README.md).                                                                                 | Pages                |

##### Routing and navigation

The Strimzi ui features routing and navigation support for all pages in the UI. This is implemented via the use of [`React Router`](https://github.com/ReactTraining/react-router) in the [`Navigation` Bootstrap component](../client/Bootstrap/Navigation/README.md), combined with [metadata which describes the pages which make up the UI](../client/Pages/README.md). Each page describes itself declaratively, including but not limited to; what it is called, which path it should reside on, how it should be rendered, and what requirements from a backend and security point of view it has. This enables pages, and their structure/relationship to other pages, to be not only more loosely coupled, but easily extensible.

Further details on how the metadata and navigation work can be found below:

- [`Navigation` component](../client/Bootstrap/Navigation/README.md)
- [Page metadata structure](../client/Pages/README.md)

##### Introspection

In a typical web UI, client code often has awareness/needs to assume what backend services are available to support the use cases it provides. For example, if a Topics administration page is provided, the client code knows of/expects a backend to expose an API to support the listing, creation, deletion and modification of Topics. If one of these APIs is not available/has not been deployed, a user may for instance try to edit a topic (for instance), only to have the request fail when the user completes their task, thus giving the user a poor experience. If the UI discovered this lack of API sooner, the user could be notified or have capabilities not shown to avoid this case. However, it is not typical in a RESTful API to have or provide a discovery API.

Similarly, through the use of feature flags or more general configuration, capabilities of a UI which require a backend API (which may not be implemented or temporarily disabled) can be disabled themselves. The challenge with these approaches however can be the amount/granularity of the configuration required, and how this is relayed to the UI at runtime.

GraphQL servers use a schema to describe the available types, their attributes, and how these can be manipulated (called mutations). Given this schema is retrievable at runtime, it can be inspected to determine what backend capabilities are available. This is known as [introspection](https://graphql.org/learn/introspection/).

The Strimzi ui will perform an introspection of the backend server when it first loads in the user's browser. It will compare the retrieved schema to a model defined in the UI, and will store the result in a [React Context](../client/Contexts/Introspect/README.md) for use across the UI. This will allow the UI to then configure itself to show or hide capabilities based on what the backend supports. Examples of this include:

- By the navigation (in combination with the [#entity-model](#entity-model)) to show or hide whole pages if a minimum set of backend requirements are not met
- By the [feature flag capability](#configuration-and-feature-flagging) in the UI to enable and disable individual features based on backend capability
- By individual `Bootstrap`, `Panel` or `Group` components on a use case by use case basis

##### Component topology

This section to follow in a future PR.

#### Server

Further details will be added to this section once https://github.com/strimzi/proposals/pull/6 and https://github.com/strimzi/proposals/pull/9 have been finalized, under issue https://github.com/strimzi/strimzi-ui/issues/16 .

#### Entity model

A UI typically allows a user to interact with resources. These resources are types of known entity (eg a Topic), which typically can be created, read, updated or deleted. Similarly, entities are often protected by authorization controls, restricting a user's access or ability to create, read, update or delete a given named entity or entity type. In the case of authorization for example, different mechanisms may be used to grant or reject the ability to create for instance. Equally, the ability to 'retrieve' an entity may vary (i.e retrieve the whole entity, or just a particular attribute) by use case. From a UI point of view, the 'how' of an operation on an entity is not important. What is important is if we can or cannot, and how the UI should ultimately respond to that.

Thus, to help encapsulate these cases and capabilities, the Strimzi ui (both client and server) uses a simple 'entity model' to help describe/define what entities are used in a given scenario, and what operations need to be performed on them. These operations typically will take the form of CRUD actions (although additional actions can also be provided/checked on a case by case basis), which will be checked at runtime via a defined callback for that action, with the callback being provided appropriate state so it can return a `true` or `false` result, indicating if 'this' action on 'this' entity is currently possible. Keys for common operations on any entity (ie `CREATE`,`READ`,`UPDATE` and `DELETE`) will be defined in [`entityModelConstants.js`](../utils/entityModelConstants.js), with more specific keys being added as required.

In the case of the Strimzi ui, this approach is used currently to describe backend capability required to show a page at minimum, and what authorization rights a user requires to access a page at minimum ([More details available here](../client/Pages/README.md)). In this case, the callbacks are provided with either [the result of GraphQL introspection](#introspection)) or current known authorization state respectively, which are then processed/checked in the callback to return the required `true`/`false` result.

For example, assuming we are checking backend API capability state (which we destructure to just have topic state) for the minimum requirements to show a Topic page, the model would look as follows:

```
{
  Topic: {
    CREATE: ({topic}) => topic.operations.addTopic,
    READ: ({topic}) => topic.field.name && topic.field.partitions && topic.field.replicas,
    liveUpdates: ({topic}) => topic.subscriptions.topicsUpdated
  }
}
```

In this case, the exact fields, operations (and in this case, extra page specific capabilities as well) can be defined and validated.

_Note_: Implementation to follow in a later PR.

#### Configuration and feature flagging

This section to follow in a future PR/as a part of https://github.com/strimzi/strimzi-ui/issues/13 .

### Code Structure

To support the goals of extensibility and aid consistency across the code base, the code in this repository has been arranged in an opinionated manner. This section will detail that structure, and why it has been set up in this way.

#### Directory structure

UI codebases tend to contain a large number of files, so sensible organisation not only keeps the code neat and tidy, but can help provide context for what particular areas do/are responsible for. The following covers what directories exist in the root of this repository, and their content:

| Directory     | Contains                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------- |
| client/\*     | All code served to the browser                                                            |
| docs          | All 'repository level' documentation                                                      |
| docs/assets   | Assets used to support documentation - images etc                                         |
| server/\*     | All code related to the UI server implementation                                          |
| utils         | Utility code and configuration used by both client and server, and to support development |
| utils/build   | Build implementation and configuration                                                    |
| utils/headers | Copyright header statements                                                               |
| utils/linting | Code style, linting and formatting configuration and supporting code                      |

As mentioned in the Code Style document (https://github.com/strimzi/strimzi-ui/issues/4), all of these directories will include a README file providing further details on what they contain.

#### `Element` `Group` `Panel` `Bootstrap` component pattern

React provides a declarative approach to building UIs by describing and defining UIs and their behaviours as composable components. Given a React component represents a composable UI capability, any and all components could be used in any scenario equally and repeatedly, regardless of if they represent a single line of text, or a whole page. This is one of React's great strengths. However, depending on the behaviour the component provides, and what properties and or context it needs to function, not all components when used in reality can be composed like this. Likewise, when implementing new elements of UI, it often is very easy to implement what you see in one monolithic component, rather than consider all the behaviours (thus components) that make up that UI. Finally, depending on the role these components play in the UI, further considerations, such as how and what they require to be tested should be tested also need to be contemplated.

To combat these cases, the React components written to implement this UI have been deliberately classified into one of the four types, encapsulating their purpose, behaviour, usage, and how they are tested. This thus helps keep components composable and correctly scoped at design time, easy to develop/maintain when implemented, and ultimately help enable a good and consistent user experience. These types are detailed below:

- [`Element`](../client/Elements) are simple presentational components, taking only React `properties` as input
- [`Group`](../client/Groups) contain one to many `Element` components, and may also contain a Model to provide business logic
- [`Panel`](../client/Panels) components contain zero to many `Element` and/or `Group` components. These typically will represent a page, and will have a Model to manage it's state
- [`Bootstrap`](../client/Bootstrap) components bootstrap the UI - they set up state management, clients, and other top level UI items so the rest of the UI can operate

The READMEs for each of these component types will cover the expectations from an implementation, test and usage point of view.

#### Swap-able view layers

One of the areas of extensibility this UI offers is that of the View layer implementation it uses. This allows the Strimzi-ui to quickly change it's look and feel if a user needs it to, while maintaining the same core business and backend logic that make the UI work. Implemented view layer implementations for the Strimzi-ui are detailed below, along with what environment variable (`VL`) value would need to be provided to build the UI using a particular View layer implementation:

| Framework/Library used in view layer                        | Environment variable value `VL` | Code suffix       | Default (if environment variable not provided/all components have view layer provided) |
| ----------------------------------------------------------- | ------------------------------- | ----------------- | -------------------------------------------------------------------------------------- |
| [Carbon design system](https://www.carbondesignsystem.com/) | `CARBON`                        | `*.carbon.js`     | ✅                                                                                     |
| [PatternFly](https://www.patternfly.org/v4/)                | `PATTERNFLY`                    | `*.patternfly.js` |                                                                                        |

This dynamic view layer capability is possible due to our [Webpack Aliasing strategy](./Build.md#webpack-aliases), and [React Hooks](https://reactjs.org/docs/hooks-intro.html#motivation).

React Hooks enable the sharing of common business logic between React components, without tightly coupling the given business logic to the rendering logic. The intent of Hooks are to share common utility logic between components, such as state management or translation tools. We use [(and have implemented our own)](../client/Hooks/README.md) hooks not only for this purpose, but to also provide business logic to components that need them in a `Model` hook. The `Model` hook owns all state management and business logic for a given component, and returns to the `View` layer any information it needs to render a result (in a reducer esq manner). Given a `Model` hook owning a component's state and logic, any number of `View` layer implementations could make use of that `Model`.

These `View` layer implementations are expected to implement Framework specific rendering code, including importing any required styling, for the given component. Do note, if a component is either visually identical across all implementations, or only ever used in one framework, only one `View` layer implementation needs to be provided (and the View alias is not required).

Given N `View` layer implementations for a component, we at build/development time use [a View Webpack alias](./Build.md#webpack-aliases) to then abstract these layers, and decide which is used in the UI. The provided `VL` environment variable value maps to a suffix, that is then substituted dynamically into the View Webpack alias. As an example, given a `Group` component `Bar`, it would contain the following files:

```
Groups/
  Bar/
    index.js
    View.carbon.js
    Styling.carbon.scss
    View.patternfly.js
    Styling.patternfly.scss
    Model.js
    ...
```

At build time, the exported [`View` alias](./Build.md#webpack-aliases) used in `index.js`:

```
export * from 'View';
```

... will resolve to either one of `View.carbon.js` or `View.patternfly.js` (depending on the value of `VL`). In addition to the `View` alias, a `Styling` alias also will be provided, and is expected to be used to abstract between different (s)css implementations between the view layers.

When used in other components, this would (in combination with the `Group`) alias mean a developer would use `Bar` in their code as follows:

```
...
import { Bar } from 'Groups';
...
```

Note that due to the aliases that the implementation details are completely abstracted. In addition, the `VL` environment variable value is also used to enable and disable framework specific linting and format rules.

For this capability to work, [file name conventions](#file-name-conventions) need to be followed (so the aliases align with file names), and the properties/behaviours exposed by components should align: all that should be different should be how a capability is rendered - not it's capability. If different behaviours are required, different components should be implemented to provide these.

_Note_: Implementation of this will follow in a future PR.

### Supporting utilities and tools

To support development and test of the Strimzi UI, a number of tools and utilities are used. This section will detail those tools, what they are used for, and high level configuration and setup choices.

#### Storybook

This section to follow in a future PR/as a part of https://github.com/strimzi/strimzi-ui/issues/14 .

#### Mock admin server

This section to follow in a future PR/as a part of https://github.com/strimzi/strimzi-ui/issues/15 .
