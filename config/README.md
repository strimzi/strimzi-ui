# Config

This directory contains all configuration for both the client and server of the Strimzi-ui ([described here](../docs/Architecture.md#configuration-and-feature-flagging)).

- `runtime.ts` - will contain all configuration options which require resolution at server runtime to return a value
- `static.ts` - will contain all configuration options where values can be defined literally
- `featureflags.ts` - will contain all feature flags. These could be defined literally, or require a callback to resolve (like `runtime.ts` configuration values)
- `index.ts` - acts as a barrel file for all types, merging them together
- `configHelpers.ts` - utility code for reducing the configuration, used in `index.ts`
- `config.types.ts` - internal types for the config module
- `types.ts` - all exported types for the config module

## Configuration sensitivity

As mentioned in [the configuration architecture section](../docs/Architecture.md#configuration-and-feature-flagging), configuration will be reduced at runtime by the server, and then hosted via the [config server module](../server/config/README.md) for the client code to access. For the vast majority of configuration, the ability to access these values externally will not be an issue. However, some values will be sensitive, meaning they should be obfuscated or redacted entirely. To support this, configuration values can be typed as a [`programmaticValue`](./config.types.ts). Any `programmaticValue` which does not include a `publicConfigValue` key will be omitted from the publicly available configuration.
