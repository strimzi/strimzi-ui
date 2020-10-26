/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import merge from 'lodash.merge';
import {
  configurationType,
  programmaticValue,
  configurationLiteralValue,
} from './types';

/** helper function to get the value of an environment variable, or a defined fallback value */
export const getEnvvarValue: (
  name: string,
  fallback?: configurationLiteralValue
) => () => configurationLiteralValue = (
  name,
  fallback = `No value for ENVVAR ${name}`
) => () => process.env[name] || fallback;

/** helper used to process a `configurationDeclaration` or `featureFlagDeclaration` (D) to a `configurationType` with values being of type (T) for use across the codebase */
export const processConfig: <D, T>(config: Array<D>) => configurationType<T> = (
  config
) => {
  // merge all provided configs
  const mergedConfig = config.reduce(
    (acc, thisConfig) => merge(acc, thisConfig),
    {}
  );

  // iterate through config
  const processedConfiguration = Object.entries(mergedConfig).reduce(
    (acc, [key, value]) => {
      const valueType = typeof value;
      const isLiteralValue =
        valueType === 'string' ||
        valueType === 'boolean' ||
        valueType === 'number';
      const isConfigurationValue =
        !isLiteralValue &&
        (value as programmaticValue<unknown, unknown>).configValue;

      let publicValue, privateValue;

      if (isLiteralValue) {
        publicValue = value;
        privateValue = value;
      } else if (isConfigurationValue) {
        const { configValue, publicConfigValue } = value as programmaticValue<
          unknown,
          unknown
        >;
        privateValue =
          typeof configValue === 'function' ? configValue() : configValue;
        publicValue = publicConfigValue;
      } else {
        const { values, publicValues } = processConfig([value]);
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
    }
  );

  return processedConfiguration;
};
