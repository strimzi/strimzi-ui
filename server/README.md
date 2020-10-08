# Server

This directory contains all server code for the Strimzi UI - ie code which is responsible for the serving of and back channel logic to support the client code. A summary of contents can be found below:

- [`core`](./core/README.md) - the core express server logic. This document also covers how the core module interacts with the other modules
- [`client`](./client/README.md) - handlers for returning built client code to a user's web browser
- [`mockapi`](./mockapi/README.md) - handlers for emulating a real instance of `Strimzi-admin` in dev and test scenarios
- `main.ts` - the build entry point for the production UI server. It bootstraps the server, and owns the creation and management of a node `http`/`https` server (and binding express to it).
- `serverConfig.ts` - configuration handling module. If an `configPath` envar is provided, the file specified is used for the server's configuration, else, `server.config.json` in the current working directory will be used. If neither exist, a default config defined in this module will be used.
- `types.ts` - custom types and interfaces used in the server code base.
- `tsconfig.json` - Typescript config for this codebase
