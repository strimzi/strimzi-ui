/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import merge from 'lodash.merge';
import {
  PublicConfig,
  ProgrammaticValue,
  Config,
  Literal,
} from './config.types';

/** helper function to get the value of an environment variable, or a defined fallback value */
export const getEnvvarValue: (
  name: string,
  fallback?: string
) => () => string = (name, fallback = `No value for ENVVAR ${name}`) => () =>
  process.env[name] || fallback;

/** helper used to process sets of `configurationDeclaration` or `featureFlagDeclaration` (D) to a `configurationType` with values being of type (T) for use across the codebase.
 * @param config - an array of `D` config decelerations. Important! If the same key is present in any `config`s provided in this array, the latter value will take precedence/be returned in the output
 * @returns a configuration object ready to use in across the UI
 */
export const processConfig = <T extends Literal>(
  config: Config<T>[]
): PublicConfig<T> => {
  // merge all provided configs
  const mergedConfig = config.reduce<Config<T>>(
    (acc, thisConfig) => merge(acc, thisConfig),
    {} as Config<T>
  );

  // iterate through config
  const processedConfiguration: PublicConfig<T> = Object.entries(
    mergedConfig
  ).reduce(
    (acc, [key, value]) => {
      const valueType = typeof value;
      const isLiteralValue =
        valueType === 'string' ||
        valueType === 'boolean' ||
        valueType === 'number';
      const isConfigurationValue =
        !isLiteralValue &&
        (value as ProgrammaticValue<T>).configValue !== undefined;

      let publicValue, privateValue;

      if (isLiteralValue) {
        publicValue = value;
        privateValue = value;
      } else if (isConfigurationValue) {
        const { configValue, publicConfigValue } = value as ProgrammaticValue<
          T
        >;
        privateValue =
          typeof configValue === 'function' ? configValue() : configValue;
        publicValue = publicConfigValue;
      } else {
        const { values, publicValues } = processConfig([value as Config<T>]);
        publicValue = publicValues;
        privateValue = values;
      }
      const { values, publicValues } = acc;
      return {
        values: { ...values, [key]: privateValue },
        publicValues: { ...publicValues, [key]: publicValue },
      };
    },
    {
      values: {},
      publicValues: {},
    } as PublicConfig<T>
  );

  return processedConfiguration;
};
