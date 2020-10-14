/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const fs = require('fs');
const path = require('path');

const headerTextDir = path.resolve(__dirname, './headers');
const headerTextContent = fs
  .readdirSync(headerTextDir) // read all files in the headers directory
  .filter((file) => file.includes('.txt')) // remove any which are not .txt
  .map((file) => `${headerTextDir}/${file}`) // construct file path
  .reduce((acc, fileToRead) => {
    // reduce content to a single string by
    const rawHeaderText = fs.readFileSync(fileToRead, 'utf-8'); // reading the current file
    return `${acc} * ${rawHeaderText.split('\n').join(`\n * `)}\n *\n`; // insert it's content into the header text, breaking on new lines
  }, '');

// /*! required so not stripped in build - wrap header content with start/end tags
const HEADER_TEXT = `/*!\n${headerTextContent} */`;

module.exports = {
  HEADER_TEXT, // used by build to insert into built content
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
};
