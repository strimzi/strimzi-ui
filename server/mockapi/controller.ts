/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { readFileSync } from 'fs';

export const schema = readFileSync(`${__dirname}/mockschema.gql`, {
  encoding: 'utf-8',
});
