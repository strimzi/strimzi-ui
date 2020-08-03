/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

// https://github.com/typicode/husky#supported-hooks
const config = {
  'pre-commit': 'npm run lint && git add .', // run the lint, and include any auto fixes
  'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
};

module.exports = {
  hooks: config,
};
