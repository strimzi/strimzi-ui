/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

const path = require('path');
const fs = require('fs');

const src = path.resolve(__dirname, '../client');
const moduleNames = fs.readdirSync(src);

// Aliases relative to the current file
const relativeAliases = {
  'View': `./View.js`,
  'Model': `./Model.js`,
  'Styling': `./Styling.scss`,
};

const modules = moduleNames.reduce((moduleConfig, name) => {
  const currentModule = {
    path: path.resolve(__dirname, `../client/${name}`),
    mapper: {
      regex: `^${name}(.*)$`,
      path: `<rootDir>/client/${name}$1`,
    },
  };
  return { ...moduleConfig, [name]: currentModule };
}, {});

const webpackAliases = Object.entries(modules).reduce(
  (aliases, [key, value]) => {
    const { path } = value;
    return { ...aliases, [key]: path };
  },
  {...relativeAliases}
);

module.exports = {
    webpackAliases
}