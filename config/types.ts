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
  /** internal private values */
  values: Record<string, ProcessedConfiguration<T>>;
  /** public/external values. Will be exposed via the config module in the server */
  publicValues: Record<string, ProcessedConfiguration<T>>;
};

export interface Config<T> {
  [key: string]: ConfigValue<T> | Config<T>;
}

export interface ProgrammaticValue<V> {
  /** the value used/exported for 'real' use */
  configValue: V | (() => V);
  /** the public value exposed if queried for. If not defined, no value will be accessible externally via the final `configurationType` */
  publicConfigValue?: V | (() => V);
}

export type ConfigValue<T> = T | ProgrammaticValue<T>;

export type Literal = string | number | boolean;
