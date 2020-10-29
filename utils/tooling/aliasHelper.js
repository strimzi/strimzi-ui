/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

const path = require('path');
const fs = require('fs');

const client = '../../client';
const src = path.resolve(__dirname, client);
const moduleNames = fs.readdirSync(src);

// Aliases relative to the current file
const relativeAliases = {
  View: './View.js',
  Model: './Model.js',
  Styling: './Styling.scss',
};

const relativeMocks = Object.keys(relativeAliases).join('|');
const ignoredBinaries = ['png', 'svg', 'ico', 'scss'].join('|');
const mockFile = '<rootDir>/test_common/mockfile.util.ts';

const modules = moduleNames.reduce((moduleConfig, name) => {
  const currentModule = {
    path: path.resolve(__dirname, `${client}/${name}`),
    mapper: {
      regex: `^${name}(.*)$`,
      path: `${client}/${name}$1`,
    },
  };
  return { ...moduleConfig, [name]: currentModule };
}, {});

const webpackAliases = Object.entries(modules).reduce(
  (aliases, [key, value]) => {
    const { path } = value;
    return { ...aliases, [key]: path };
  },
  { ...relativeAliases }
);

const jestModuleMapper = Object.values(modules).reduce(
  (mapping, currentModule) => {
    const {
      mapper: { regex, path },
    } = currentModule;
    return { ...mapping, [regex]: path };
  },
  {
    [`^(${relativeMocks})(.*)$`]: mockFile,
    [`^.+\\.(${ignoredBinaries})$`]: mockFile,
  }
);

module.exports = {
  webpackAliases,
  jestModuleMapper,
  relativeClientAliases: relativeAliases,
};
