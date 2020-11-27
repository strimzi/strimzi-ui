/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { client, featureFlags, server } from './index';

export * from './config.types';

export type exposedClientType = typeof client.publicValues;
export type exposedFeatureFlagsType = typeof featureFlags.publicValues;
export type exposedServerType = typeof server.publicValues;
