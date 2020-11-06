/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

// lint-staged will call these scripts with a set of files - eg npm run x 'file.txt' 'styling.css' etc
const lintChecksForAllFiles = ['npm run lint:allfiles', 'npm run lint:format']; // note: the licence tool, run as a part of `allfiles`, will update non staged files as well - this cannot be configured currently.
const lintChecksForSrcFiles = ['npm run lint:src'];
const lintChecksForStylingFiles = ['npm run lint:styling'];

// https://github.com/okonet/lint-staged#configuration
module.exports = {
  '**': lintChecksForAllFiles,
  '**.js|**.ts|**.tsx': lintChecksForSrcFiles,
  '**.(s)css': lintChecksForStylingFiles,
};
