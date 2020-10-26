/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import {
  configurationDeclaration,
  featureFlagDeclaration,
  configurationLiteralValue,
} from './types';
import { processConfig } from './configHelpers';
import { featureFlags as rawFeatureFlags } from './featureflags';
import { client as runtimeClient, server as runtimeServer } from './runtime';
import { client as staticClient, server as staticServer } from './static';

export const featureFlags = processConfig<featureFlagDeclaration, boolean>([
  rawFeatureFlags,
]);
export const client = processConfig<
  configurationDeclaration,
  configurationLiteralValue
>([staticClient, runtimeClient]);
export const server = processConfig<
  configurationDeclaration,
  configurationLiteralValue
>([staticServer, runtimeServer]);
