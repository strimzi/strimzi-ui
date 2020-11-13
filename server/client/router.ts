/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import express from 'express';
import expressStaticGzip from 'express-static-gzip';
import { render } from 'mustache';
import { getFiles } from './controller';
import { serverConfigType, UIServerModule } from 'types';

const moduleName = 'client';

export const ClientModule: UIServerModule = {
  moduleName,
  addModule: (logger, authFn, serverConfig) => {
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
    protectedFiles.forEach((file) => routerForModule.get(`${file}`, authFn));

    // return index.html, with configuration templated in
    hasIndexFile &&
      routerForModule.get('/index.html', (req, res) => {
        const { entry, debug } = res.locals.strimziuicontext.logger;
        const { exit } = entry('`/index.html handler');
        const { authentication } = res.locals.strimziuicontext
          .config as serverConfigType;
        const bootstrapConfigs = {
          authType: authentication.strategy,
        };
        debug(`Templating bootstrap config containing`, bootstrapConfigs);
        res.send(
          exit(
            render(indexFile, {
              bootstrapConfigs: encodeURIComponent(
                JSON.stringify(bootstrapConfigs)
              ),
            })
          )
        );
      });

    // host all files from the client dir
    routerForModule.get(
      '*',
      expressStaticGzip(builtClientDir, {}),
      express.static(builtClientDir, { index: false })
    );

    // if no match, not a file (path contains '.'), and we have an index.html file, redirect to it (ie return index so client navigation logic kicks in). Else do nothing (404 unless another module handles it)
    hasIndexFile &&
      routerForModule.get(/^((?!\.).)+$/, (req, res) =>
        res.redirect(`/index.html`)
      );

    return exit({ mountPoint: '/', routerForModule });
  },
};
