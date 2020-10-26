/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { configurationDeclaration } from './types';

/**
 * runtime configuration - values which can only be defined/evaluated at server runtime
 */

const client: configurationDeclaration = {};
const server: configurationDeclaration = {};

export { client, server };
