/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { Config } from './types';

/**
 * feature flag configuration - used to enable/disable capabilities across the UI/server. The values can be static or dynamic, but the value must always be boolean
 */

export const featureFlags: Config<boolean> = {};
