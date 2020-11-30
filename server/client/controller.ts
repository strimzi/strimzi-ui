/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import { resolve, sep } from 'path';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { serverConfigType } from 'types';
import { render } from 'mustache';

// function to recursively get all files from a directory
const getFilesInDirectory: (directory: string) => Array<string> = (directory) =>
  existsSync(directory)
    ? readdirSync(directory, { withFileTypes: true }).reduce((acc, fileObj) => {
        return fileObj.isFile()
          ? acc.concat([`${directory}${sep}${fileObj.name}`])
          : acc.concat(
              getFilesInDirectory(`${directory}${sep}${fileObj.name}`)
            );
      }, [] as string[])
    : [];

// mark a subset of files as public - this means any user can access them. These entries will be used in a regex - if the test passes, it will be considered public
const publicFiles = [
  'images/*',
  'fonts/*',
  'favicon.ico',
  'index.html',
  'main.css',
  'main.bundle.js',
  'main.bundle.js.gz',
];

export const getFiles: (
  publicDirectory: string
) => {
  totalNumberOfFiles: number;
  hasIndexFile: boolean;
  indexFile: string;
  protectedFiles: Array<string>;
  builtClientDir: string;
} = (publicDirectory) => {
  const builtClientDir = resolve(publicDirectory);

  // get all files in the client directory
  const allFilesInClientDirectory = getFilesInDirectory(
    builtClientDir
  ).map((fileNameAndPath) =>
    fileNameAndPath.substr(builtClientDir.length, fileNameAndPath.length)
  );

  // get a list of all files that do not match the above listed public file regex set
  const protectedFiles = allFilesInClientDirectory.reduce(
    (acc, file) =>
      !publicFiles.some((publicFile) => new RegExp(publicFile).test(file))
        ? acc.concat([file])
        : acc,
    [] as string[]
  );

  const hasIndexFile = allFilesInClientDirectory.includes('/index.html');
  const indexFile = hasIndexFile
    ? readFileSync(resolve(`${builtClientDir}${sep}index.html`), {
        encoding: 'utf-8',
      })
    : '';

  return {
    totalNumberOfFiles: allFilesInClientDirectory.length,
    hasIndexFile,
    indexFile,
    protectedFiles: protectedFiles,
    builtClientDir,
  };
};

export const renderTemplate: (indexTemplate: string) => (req, res) => void = (
  indexTemplate
) => (req, res) => {
  const { entry, debug } = res.locals.strimziuicontext.logger;
  const { exit } = entry('renderTemplate');
  const { authentication } = res.locals.strimziuicontext
    .config as serverConfigType;
  const bootstrapConfigs = {
    authType: authentication.strategy,
  };
  debug('Templating bootstrap config containing %o', bootstrapConfigs);
  res.send(
    exit(
      render(indexTemplate, {
        bootstrapConfigs: encodeURIComponent(JSON.stringify(bootstrapConfigs)),
      })
    )
  );
};
