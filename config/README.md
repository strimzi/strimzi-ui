# Config

This directory contains all configuration for both the client and server of the Strimzi-ui ([described here](../docs/Architecture.md#configuration-and-feature-flagging)).

- `runtime.ts` - will contain all configuration options which require resolution at server runtime to return a value
- `static.ts` - will contain all configuration options where values can be defined literally
- `featureflags.ts` - will contain all feature flags. These could be defined literally, or require a callback to resolve (like `runtime.ts` configuration values)
- `index.ts` - acts as a barrel file for all types, merging them together
