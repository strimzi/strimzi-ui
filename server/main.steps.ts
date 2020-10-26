/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import http from 'http';
import https from 'https';
import { resolve, sep } from 'path';
import { writeFile, mkdir } from 'fs';
import { ChildProcess, exec } from 'child_process';
import {
  Given,
  When,
  Then,
  Before,
  After,
  Fusion,
  And,
} from 'jest-cucumber-fusion';
import {
  genericWorldType,
  worldGenerator,
} from '../test_common/jest_cucumber_support/commonTestTypes';

import { devEnvToUseTls } from '../utils/tooling/runtimeDevUtils';

type testRequestType = {
  type: typeof http | typeof https;
  endpoint: string;
  statusCode: number;
  /** other arguments to spread as a part of the request */
  others?: Record<string, unknown>;
};

interface bootstrapServerWorldType extends genericWorldType {
  configurationFileCreatedInTest: boolean;
  configLocation?: string;
  serverProcess: ChildProcess;
  request: testRequestType;
}

const bootstrapServerWorld: bootstrapServerWorldType = {
  configurationFileCreatedInTest: false,
  configLocation: undefined,
  serverProcess: {} as ChildProcess,
  request: {} as testRequestType,
  context: {},
};

const { resetWorld, stepWhichUpdatesWorld, stepWithWorld } = worldGenerator(
  bootstrapServerWorld
);

const HTTP_TEST_CONFIG = {
  configLocation: resolve(
    __dirname,
    './test_common/__test_fixtures__/main.http.conf.js'
  ),
  request: {
    type: http,
    endpoint: '/api/test',
    statusCode: 418,
  },
};

const HTTPS_TEST_CONFIG = {
  configLocation: resolve(
    __dirname,
    './test_common/__test_fixtures__/main.https.conf.js'
  ),
  request: {
    type: https,
    endpoint: '/api/test',
    statusCode: 418,
    others: {
      rejectUnauthorized: false, // allow self signed certs
    },
  },
};

Before(() => {
  resetWorld();
});

Given(
  'no server configuration file',
  stepWhichUpdatesWorld((world) => {
    // no op - set no configuration value
    return {
      ...world,
      request: {
        type: http,
        endpoint: '/',
        statusCode: 404,
      },
    };
  })
);

Given(
  'an https configuration file',
  stepWhichUpdatesWorld((world) => {
    if (!devEnvToUseTls) {
      console.warn(
        '####################\nNo TLS certificates found which can be used for test. HTTP configuration will be used!. Run `npm run addDevCerts` to generate certificates\n####################'
      );
    }
    const config = devEnvToUseTls ? HTTPS_TEST_CONFIG : HTTP_TEST_CONFIG;

    return {
      ...world,
      ...config,
    };
  })
);

Given(
  'an http configuration file',
  stepWhichUpdatesWorld((world) => {
    return {
      ...world,
      ...HTTP_TEST_CONFIG,
    };
  })
);

Given(
  'a starting configuration file',
  stepWhichUpdatesWorld(async (world) => {
    return new Promise<bootstrapServerWorldType>((promiseResolve, reject) => {
      const directoryForTestConfigFile = resolve(
        __dirname,
        '../generated/test/'
      );
      const fileLocation = `${directoryForTestConfigFile}main.conf.json`;
      const moduleConfig = {
        modules: {
          api: false,
          mockapi: false,
        },
      };

      mkdir(directoryForTestConfigFile, { recursive: true }, (err) => {
        if (err) {
          reject(err);
        } else {
          // create a file with api and mock api modules disabled
          writeFile(fileLocation, JSON.stringify(moduleConfig), (err) => {
            err
              ? reject(err)
              : promiseResolve({
                  ...world,
                  configurationFileCreatedInTest: true,
                  configLocation: fileLocation,
                  request: {
                    type: http,
                    endpoint: '/api/test',
                    statusCode: 404, // as mock api disabled
                  },
                  context: {
                    startingFileContent: moduleConfig,
                    fileLocation,
                  },
                });
          });
        }
      });
    });
  })
);

When(
  'I start the server',
  stepWhichUpdatesWorld(async (world) => {
    const { configLocation } = world;
    const childEnv = configLocation
      ? {
          ...process.env,
          configPath: configLocation,
        }
      : process.env;
    const cwd = `${resolve(__dirname)}${sep}`;

    return new Promise<bootstrapServerWorldType>((resolve, reject) => {
      // run ts-node in a subprocess, which is running the server
      const childProcess = exec(
        `npx ts-node -r tsconfig-paths/register --project ${cwd}tsconfig.json ${cwd}main.ts`,
        { env: childEnv },
        (_, stdOut, stdErr) => {
          stdOut && console.log(stdOut);
          stdErr && console.error(stdErr);
        }
      );

      childProcess.on('error', reject);
      setTimeout(
        () =>
          resolve({
            ...world,
            serverProcess: childProcess,
          }),
        5000 // time required to start the server
      );
    });
  })
);

Then(
  'the server starts',
  stepWithWorld(async (world) => {
    const { type, endpoint, statusCode, others = {} } = world.request;
    return new Promise<void>((resolve, reject) => {
      const testRequest = type.request(
        {
          hostname: 'localhost',
          port: 3000,
          path: endpoint,
          method: 'GET',
          ...others,
        },
        (res) => {
          expect(res.statusCode).toBe(statusCode);
          resolve();
        }
      );
      testRequest.on('error', reject);
      testRequest.end();
    });
  })
);

const makeRequestFromWorldConfig = async (world: bootstrapServerWorldType) => {
  const { type, endpoint, statusCode, others = {} } = world.request;
  return new Promise<void>((resolve, reject) => {
    const testRequest = type.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: endpoint,
        method: 'GET',
        ...others,
      },
      (res) => {
        expect(res.statusCode).toBe(statusCode);
        resolve();
      }
    );
    testRequest.on('error', reject);
    testRequest.end();
  });
};

And(
  'I make a configuration change',
  stepWhichUpdatesWorld(async (world) => {
    return new Promise<bootstrapServerWorldType>((promiseResolve, reject) => {
      const { fileLocation } = world.context;
      const moduleConfig = {
        modules: {
          api: false,
          mockapi: true,
        },
      };
      // make a change to the mock file
      writeFile(fileLocation as string, JSON.stringify(moduleConfig), (err) => {
        err
          ? reject(err)
          : promiseResolve({
              ...world,
              request: {
                type: http,
                endpoint: '/api/test',
                statusCode: 418, // as mockapi is now enabled
              },
            });
      });
    });
  })
);

Then(
  'the server reflects that configuration change',
  stepWithWorld(makeRequestFromWorldConfig)
);

After(
  stepWithWorld(async (world) => {
    return new Promise<void>((resolve) => {
      const { serverProcess } = world;
      if (serverProcess.exitCode === null) {
        // the process is still running. End it
        serverProcess.on('close', resolve);
        serverProcess.kill('SIGTERM');
      } else {
        resolve();
      }
    });
  })
);

Fusion('main.feature');
