/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { resolve, sep } from 'path';
import fs from 'fs';

const builtClientDir = resolve('./dist/client'); // location of the built client code

// function to recursively get all files from a directory
const getFilesInDirectory: (directory: string) => Array<string> = (directory) =>
  fs.existsSync(directory)
    ? fs
        .readdirSync(directory, { withFileTypes: true })
        .reduce((acc, fileObj) => {
          return fileObj.isFile()
            ? acc.concat([`${directory}${sep}${fileObj.name}`])
            : acc.concat(
                getFilesInDirectory(`${directory}${sep}${fileObj.name}`)
              );
        }, [] as string[])
    : [];

// get all files in the client directory
const allFilesInClientDirectory = getFilesInDirectory(
  builtClientDir
).map((fileNameAndPath) =>
  fileNameAndPath.substr(builtClientDir.length, fileNameAndPath.length)
);

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

// get a list of all files that do not match the above listed public file regex set
const protectedFiles = allFilesInClientDirectory.reduce(
  (acc, file) =>
    !publicFiles.some((publicFile) => new RegExp(publicFile).test(file))
      ? acc.concat([file])
      : acc,
  [] as string[]
);

const hasIndexFile = allFilesInClientDirectory.includes('/index.html');
const totalNumberOfFiles = allFilesInClientDirectory.length;

export { totalNumberOfFiles, protectedFiles, builtClientDir, hasIndexFile };
