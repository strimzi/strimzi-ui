/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

/** a raw literal configuration value can be a primitive or an object which implements the `configurationDeclaration` interface */
type rawConfigurationLiteralValue =
  | configurationLiteralValue
  | configurationDeclaration;

/** a raw literal feature flag value can be a boolean or an object which implements the `featureFlagDeclaration` interface */
type rawFeatureFlagLiteralValue = boolean | featureFlagDeclaration;

/** a programmaticValue is used when there is a runtime option to evaluate, and/or a need to suppress/not expose the value via the server's config module (the value provided in `public` would be used instead) */
export interface programmaticValue<R, P> {
  /** the value used/exported for 'real' use */
  configValue: R | (() => P);
  /** the public value exposed if queried for. If not defined, no value will be accessible externally via the final `configurationType` */
  publicConfigValue?: P | (() => P);
}

/** all configuration values are either strings, bools or numbers */
export type configurationLiteralValue = string | boolean | number;

/** configuration type/schema used in the config directory - all configuration values are either of shape `programmaticValue` or a literal value from type `rawConfigurationLiteralValue` */
export interface configurationDeclaration {
  [key: string]:
    | rawConfigurationLiteralValue
    | programmaticValue<
        rawConfigurationLiteralValue,
        configurationLiteralValue
      >;
}

/** feature flag type/schema used in the config directory - all configuration values are either of shape `programmaticValue` or a literal value from type `rawFeatureFlagLiteralValue` */
export interface featureFlagDeclaration {
  [key: string]:
    | rawFeatureFlagLiteralValue
    | programmaticValue<rawFeatureFlagLiteralValue, boolean>;
}

/** structure of processed configuration. Key value pairs, mapping to either a `T` or a nested `processedConfiguration` */
interface processedConfiguration<T> {
  [key: string]: T | processedConfiguration<T>;
}

/** external facing (ie for use in the UI) configuration object */
export type configurationType<T> = {
  /** internal private values */
  values: Record<string, processedConfiguration<T>>;
  /** public/external values. Will be exposed via the config module in the server */
  publicValues: Record<string, processedConfiguration<T>>;
};
