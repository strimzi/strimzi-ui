# Server

This directory contains all server code for the Strimzi UI - ie code which is responsible for the serving of and back channel logic to support the client code. A summary of contents can be found below:

- [`api`](./api/README.md) - module which proxies backend requests to the configured strimzi-admin server
- [`client`](./client/README.md) - handlers for returning built client code to a user's web browser.
- [`config`](./config/README.md) - module which serves UI configuration to the client.
- [`core`](./core/README.md) - the core express server logic. This document also covers how the core module interacts with the other modules.
- [`log`](./log/README.md) - module that handles client logging events.
- [`mockapi`](./mockapi/README.md) - handlers for emulating a real instance of `Strimzi-admin` in dev and test scenarios. Also allows the configuration of the server to be changed to enable test scenarios.
- [`test`](./test/README.md) - common test code and helpers for the UI server.
- `logging.ts` - logging handling module. Uses the logging configuration from the server's configuration to create the `pino` and `pino-http` loggers, and extends the Logger object with entry and exit tracing methods.
- `main.ts` - the build entry point for the production UI server. It bootstraps the server, and owns the creation and management of a node `http`/`https` server (and binding express to it).
- `serverConfig.ts` - configuration handling module. If an `configPath` envar is provided, the file specified is used for the server's configuration, else, `server.config.json` in the current working directory will be used. If neither exist, a default config defined in this module will be used.
- `types.ts` - custom types and interfaces used in the server code base.
- `tsconfig.json` - Typescript config for this codebase.
