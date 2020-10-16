# dev_config

This directory contains helper code and configuration used when developing the Strimzi UI. It is not intended to be shipped. Files include:

- [`mockadmin.config.js`](./mockadmin.config.js) - configuration for the mock admin server
- [`server.dev.config.js`](./server.dev.config.js) - configuration for the server used during development
- [`server.e2e.config.js`](./server.e2e.config.js) - configuration for the server used during e2e tests
- `req.conf` - `openssl` configuration for generated certificates. Used by [`generateCerts.sh`](../tooling/generateCerts.sh).
