/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import express from 'express';
import expressStaticGzip from 'express-static-gzip';
import { getFiles, renderTemplate } from './controller';
import { UIServerModule } from 'types';

const moduleName = 'client';

export const ClientModule: UIServerModule = {
  moduleName,
  addModule: (logger, { checkAuth }, serverConfig) => {
    const { publicDir } = serverConfig.client;
    const { exit } = logger.entry('addModule', publicDir);
    const routerForModule = express.Router();

    const {
      totalNumberOfFiles,
      protectedFiles,
      builtClientDir,
      hasIndexFile,
      indexFile,
    } = getFiles(publicDir);

    logger.debug(
      `Client is hosting ${totalNumberOfFiles} static files, ${protectedFiles.length} of which are protected and require authentication`
    );
    logger.debug(`Client has index.html to serve? ${hasIndexFile}`);

    // add the auth middleware to all non public files
    protectedFiles.forEach((file) => routerForModule.get(`${file}`, checkAuth));

    // Direct request for index, serve it (behind auth check)
    hasIndexFile &&
      routerForModule.get('/index.html', checkAuth, renderTemplate(indexFile));

    // host all files from the client dir
    routerForModule.get(
      '*',
      expressStaticGzip(builtClientDir, { index: false }),
      express.static(builtClientDir, { index: false })
    );

    // If no match and we have an index, serve it (behind auth check)
    hasIndexFile &&
      routerForModule.get('*', checkAuth, renderTemplate(indexFile));

    return exit({ mountPoint: '/', routerForModule });
  },
};
