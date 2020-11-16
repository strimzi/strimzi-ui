/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import merge from 'lodash.merge';
import { PublicConfig, ProgrammaticValue, Config, Literal } from './types';

/** helper function to get the value of an environment variable, or a defined fallback value */
export const getEnvvarValue: (
  name: string,
  fallback?: Literal
) => () => Literal = (name, fallback = `No value for ENVVAR ${name}`) => () =>
  process.env[name] || fallback;

/** helper used to process a `configurationDeclaration` or `featureFlagDeclaration` (D) to a `configurationType` with values being of type (T) for use across the codebase */
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
        !isLiteralValue && (value as ProgrammaticValue<T>).configValue;

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
