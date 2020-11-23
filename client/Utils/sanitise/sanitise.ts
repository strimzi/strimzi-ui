/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
// we explicitly only want `.` as an allowed character (vs `.`, matching any character)
// eslint-disable-next-line no-useless-escape
const allowedURLParamCharacters = new RegExp(/^[a-zA-Z0-9\.,_\-=]*$/);
/**
 * sanitiseUrlParams returns an object containing all parameters names and values from a URL, with either names or values which do not match the `allowedURLParamCharacters` regex removed. The output of this function can thus be used safely, with potentially dangerous user input removed
 * @param urlParams - the params to parse, eg from `window.search`
 * @returns an object with the key being the parameter name, and the value being the value
 */
export const sanitiseUrlParams: (
  urlParams: string
) => Record<string, string> = (urlParams) =>
  Array.from(new URLSearchParams(urlParams).entries()) // create an array of entries from the parsed params
    .filter(
      ([key, value]) =>
        allowedURLParamCharacters.test(key) &&
        allowedURLParamCharacters.test(value)
    ) // remove any entry where either the key or value does not pass the `allowedURLParamCharacters` regex
    .reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value }),
      {} as Record<string, string>
    ); // reduce into an object
