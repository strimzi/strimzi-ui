/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { Config, Literal } from './types';

/**
 * runtime configuration - values which can only be defined/evaluated at server runtime
 */

const client: Config<Literal> = {};
const server: Config<Literal> = {};

export { client, server };
