/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

const ignoredBinaries = ['png', 'svg', 'ico', 'scss'].join('|');
const testCommon = '<rootDir>/../test_common';
const mockFile = `${testCommon}/mockfile.util.ts`;

const jestModuleMapper = {
  [`^.+\\.(${ignoredBinaries})$`]: mockFile,
};

module.exports = {
  jestModuleMapper,
};
