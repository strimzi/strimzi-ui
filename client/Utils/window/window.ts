/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
/** Returns the current location object from the global Window object */
export const getLocation: () => Location = () => window.location;
