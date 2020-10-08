/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

const rulesets = [
  'stylelint-config-standard',
  'stylelint-config-recommended',
  'stylelint-config-sass-guidelines',
];

// see https://github.com/stylelint/awesome-stylelint for config
module.exports = {
  // extend recommended rule sets - combine with prettier config, which must go last to work properly
  extends: rulesets.concat(['stylelint-config-prettier']),
  // ignore built files
  ignoreFiles: ['**/dist'],
};
