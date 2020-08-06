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
- [Code structure](#code-structure)
  - [Directory structure](#directory-structure)
  - [`Element`, `Group`, `Panel`, `Bootstrap` component pattern](#element-group-panel-bootstrap-component-pattern)
  - [Swap-able view layers](#swap-able-view-layers)
- [Implementation details](#implementation-details)
  - [Front end (client)](#client)
    - [Routing and navigation model](#routing-and-navigation)
    - [Component topology](#component-topology)
  - [Back end (server)](#server)
  - [Configuration and feature flagging](#configuration-and-feature-flagging)
- [Supporting utilities and tools](#supporting-utilities-and-tools)
  - [Storybook](#storybook)
  - [Mock admin server](#mock-admin-server)

### Overview and objectives

The purpose of this UI is to provide a user of Strimzi a delightful Kafka administration user experience. To achieve this, focus of course needs to be placed on things like the design to make the UI intuitive to use. However, user experience is more than just the design: it also is the code, and it's ability to enable those experiences. The following documentation will detail the deliberate design, engineering and behavioural choices made to achieve this objective.

In addition, we have set the following behaviours/goals/considerations for all development done in this repository:

- Focusing on the user, be they developer or end user, at all times
- To make the codebase as approachable as possible through the use of consistent and intuitive style, and supporting documentation
- To make the codebase extensible and configurable
- Adopting a cloud like CI/CD development model: lots of small and often changes, appropriately flagged, with the `master` branch being shippable at any time
- Use automation as much as possible to maintain a CI/CD model - things like automated dependency updates, issue management etc

### Security

The UI will include a (configurable - including off) security model, which will map authenticated users to roles (with authorizations associated), and thus reflect in what they can access and do in the UI itself. 

Further details will be added to this section once https://github.com/strimzi/proposals/pull/6 and https://github.com/strimzi/proposals/pull/9 have been finalized.

### Topology

The following section will detail how the UI in this repository integrates with related/supporting components when deployed in production, but also at development and test time. A client side [component topology can be found here.](#component-topology)

#### Production topology

*Further details will be added to this section once https://github.com/strimzi/proposals/pull/6 has been finalized.*

*Proposal*: The UI when deployed as a part of Strimzi could look as follows:

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

### Code Structure

#### Directory structure

#### Element Group Panel Bootstrap component pattern

#### Swap-able view layers

### Implementation details

#### Client

##### Routing and navigation

##### Component topology

#### Server

Further details will be added to this section once https://github.com/strimzi/proposals/pull/6 and https://github.com/strimzi/proposals/pull/9 have been finalized.

#### Configuration and feature flagging

### Supporting utilities and tools

#### Storybook

#### Mock admin server









