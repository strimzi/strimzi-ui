/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

/** structure of processed configuration. Key value pairs, mapping to either a `T` or a nested `processedConfiguration` */
interface ProcessedConfiguration<T> {
  [key: string]: T | ProcessedConfiguration<T>;
}

/** external facing (ie for use in the UI) configuration object */
export type PublicConfig<T> = {
  /** internal private configuration values */
  values: Record<string, ProcessedConfiguration<T> | T>;
  /** public/external values. Will be exposed via the config module in the server */
  publicValues: Record<string, ProcessedConfiguration<T> | T>;
};

/** internal configuration definition type - an object of which its values will either be of type `ConfigValue<T>`, or a sub instance of `Config<T>` */
export interface Config<T> {
  [key: string]: ConfigValue<T> | Config<T>;
}

/** internal configuration may need to be either evaluated at runtime, or present different values depending on context. `ProgrammaticValue<V>` defines an interface allowing the definition of a dynamic (or static) value, which can then be replaced with another value if required */
export interface ProgrammaticValue<V> {
  /** the value used/exported for 'real' use */
  configValue: V | (() => V);
  /** the public value exposed if queried for. If not defined, no value will be accessible externally via the final `configurationType` */
  publicConfigValue?: V | (() => V);
}

/** when defining configuration, the value can either be literal value of type `T`, or a `ProgrammaticValue<T>`, where T is determined at runtime, or requires a different value to be exposed publicly*/
export type ConfigValue<T> = T | ProgrammaticValue<T>;

/** a `Literal` configuration value in the UI config is either a string, number or boolean value */
export type Literal = string | number | boolean;
