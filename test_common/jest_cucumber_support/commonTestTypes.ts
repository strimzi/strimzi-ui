/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
export interface genericWorldType {
  /** area for tests to put test specific information which need passing between steps */
  context: Record<string, unknown>;
}

interface withWorldInterface<T extends genericWorldType> {
  (callback: (world: T, ...others: Array<unknown>) => T): (
    ...others: Array<unknown>
  ) => void;
  (callback: (world: T, ...others: Array<unknown>) => void): (
    ...others: Array<unknown>
  ) => void;
}

/** generates a world for use in cucumber tests. The world must extend genericWorldType. The world value provided will be used as the staring value/reset to via the returned resetWorld() function */
export const worldGenerator: <T extends genericWorldType>(
  world: T
) => {
  /** function to restore the world to a starting state. Call this before each test */
  resetWorld: () => void;
  /* wraps your callback with one which adds world access. It will invoke your callback passing the world in argument one, and then any others following. This function allows access the world, but also to update it. Your step's callback should return the world once complete so the new world object can be used by downstream steps */
  stepWhichUpdatesWorld: withWorldInterface<T>;
  /** wraps your callback with one which adds world access. It will invoke your callback passing the world in argument one, and then any others following. */
  stepWithWorld: withWorldInterface<T>;
} = (world) => {
  let worldInstance = world;

  return {
    resetWorld: () => {
      worldInstance = { ...world };
    },
    stepWhichUpdatesWorld: (callback) => async (...others) =>
      (worldInstance = await callback(worldInstance, ...others)),
    stepWithWorld: (callback) => (...others) =>
      callback(worldInstance, ...others),
  };
};
