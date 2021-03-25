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
- `jest.config.js` - Jest config for this codebase.

## Configuration options

As described in [the configuration approach](../docs/Architecture.md#configuration-and-feature-flagging), the UI server's configuration is provided via a file, which is then watched at runtime for modification. This configuration file is expected to be called `server.config.json` (available in the same directory as the `node` executable is run from), but this can be configured at runtime via environment variable `configPath`, dictating a different path and file name. The file must be either valid JSON or JS. The server also hosts configuration for discovery by the client via the `config` module. The configuration options for the server provided in the previously mentioned configuration file are as follows:

| Configuration            | Required | Default                                                                                                                | Purpose                                                                                                                                                             |
| ------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| client.configOverrides   | No       | `{}`                                                                                                                   | Overrides to send to the client. See [client configuration for further details](#client-configuration). These values will take precedence over any others provided. |
| client.publicDir         | No       | `/dist/client`                                                                                                         | The location of the built client to serve.                                                                                                                          |
| client.transport.cert    | No       | N/A - if one of `client.transport.cert` or `client.transport.key` are not provided, server will be HTTP                | PEM certificate presented to browsers on connecting to the UI server.                                                                                               |
| client.transport.key     | No       | N/A - if one of `client.transport.cert` or `client.transport.key` are not provided, server will be HTTP                | PEM certificate private key for the certificate provided in `client.transport.cert`.                                                                                |
| client.transport.ciphers | No       | default set from [node's tls module](https://nodejs.org/api/tls.html#tls_modifying_the_default_tls_cipher_suite)       | TLS ciphers used/supported by the HTTPS server for client negotiation. Only applies if starting an HTTPS server.                                                    |
| client.transport.minTLS  | No       | `TLSv1.2`                                                                                                              | Minimum TLS version supported by the server. Only applies if starting an HTTPS server. Set to `TLSv1.2` for browser compatibility.                                  |
| featureFlags             | No       | `{}`                                                                                                                   | Feature flag overrides to set. The configuration is as per the format specified [here](#feature-flags). These values will take precedence over any others provided. |
| hostname                 | No       | '0.0.0.0'                                                                                                              | The hostname the UI server will be bound to.                                                                                                                        |
| logging                  | No       | TBD                                                                                                                    | Logging configuration settings. Format to be defined in https://github.com/strimzi/strimzi-ui/issues/24                                                             |
| modules                  | No       | Object - [enabled modules and configuration can be found here](../docs/Architecture.md#router-controller-data-pattern) | The modules which are either enabled or disabled.                                                                                                                   |
| port                     | No       | 3000                                                                                                                   | The port the UI server will be bound to.                                                                                                                            |
| proxy.transport.cert     | No       | If not provided, SSL certificate validation of the upstream admin server is disabled                                   | CA certificate in PEM format of the backend admin server api requests are to be sent to.                                                                            |
| proxy.hostname           | Yes      | N/A                                                                                                                    | The hostname of the admin server to send api requests to.                                                                                                           |
| proxy.port               | Yes      | N/A                                                                                                                    | The port of the admin server to send api requests to.                                                                                                               |
| proxy.authentication     | Yes      | `{}`                                                                                                                   | What authentication strategy to use to authenticate users. See [the security section](#security) for details of the available options.                              |
| session.name             | no       | `strimzi-ui`                                                                                                           | The name used to identify the session cookie                                                                                                                        |

### Security

#### None

```js
{
  type: 'none';
}
```

#### Scram

```js
{
  type: 'scram';
}
```

#### OAuth

```js
{
  type: string //Must be "oauth",
  callbackURL: string, //Absolute URL that the oauth server can redirect to. The path must be '/auth/callback',
  discoveryURL: string, //Absolute URL to the well-known config endpoint on the OAUTH server
  clientID : string, //client ID to identify this application, provided when registering with OAUTH server
  clientSecret: string //client secret for this application, provided when registering with OAUTH server
}
```
