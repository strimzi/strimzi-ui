/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import express from 'express';
import expressStaticGzip from 'express-static-gzip';
import { totalNumberOfFiles, protectedFiles, builtClientDir, hasIndexFile } from './controller';
import { UIServerModule } from 'types';

const moduleName = 'client';

export const ClientModule: UIServerModule = {
  moduleName,
  addModule: (logGenerator, authFn) => {
    const { entry } = logGenerator(moduleName);
    const { debug, exit } = entry('addModule');
    const routerForModule = express.Router();

    debug(`Client is hosting ${totalNumberOfFiles} static files,  ${protectedFiles.length} of which are protected and require authentication`);
    debug(`Client has index.html to serve? ${hasIndexFile}`);

    // add the auth middleware to all non public files
    protectedFiles.forEach((file) => routerForModule.get(`${file}`, authFn));

    // host all files from the client dir
    routerForModule.get(
      '*',
      expressStaticGzip(builtClientDir, {}),
      express.static(builtClientDir)
    );

    // if no match, and we have an index.html file, redirect to it
    hasIndexFile &&
      routerForModule.get('*', (req, res) => res.redirect(`/index.html`));

    return exit({ mountPoint: '/', routerForModule });
  },
};
