/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { bootstrapPassport } from './bootstrap';
import express from 'express';
import { authenticationStrategies } from 'types';
import {
  stepWhichUpdatesWorld,
  stepWithWorld,
} from 'test_common/commonServerSteps';
import { When, Then, Fusion, And } from 'jest-cucumber-fusion';
import request from 'supertest';
import { Authentication } from 'security';

const proxyDefaults = {
  hostname: '',
  port: 0,
  contextRoot: '/',
  transport: {},
};

When(
  /^I bootstrap passport with authentication type '(\w+)'$/,
  stepWhichUpdatesWorld(async (world, authType) => {
    try {
      const auth = await bootstrapPassport(
        world.context.app as express.Application,
        {
          authentication: { type: authType as authenticationStrategies },
          ...proxyDefaults,
        }
      );
      world.context.auth = auth;
    } catch (e) {
      world.context.error = e;
    }

    return world;
  })
);

And(
  'the request is authenticated',
  stepWithWorld((world) => {
    const app = world.context.app as express.Application;
    app.get('*', (req, _res, next) => {
      req.isAuthenticated = () => true;
      return next();
    });
  })
);

Then(
  /^check auth redirects to '(.+)'$/,
  stepWithWorld((world, redirectUrl) => {
    const app = world.context.app as express.Application;
    const auth = world.context.auth as Authentication;
    app.get('/test', auth.checkAuth, (_req, res) => {
      res.send('success');
    });

    return request(app)
      .get('/test')
      .expect(302)
      .expect('Location', redirectUrl as string);
  })
);

Then(
  /^check auth returns '(\d+)'$/,
  stepWithWorld((world) => {
    const app = world.context.app as express.Application;
    const auth = world.context.auth as Authentication;
    app.get('/test', auth.checkAuth, (_req, res) => {
      res.send('success');
    });
    return request(app).get('/test').expect(200);
  })
);

Then(
  /^logout returns '(\d+)'$/,
  stepWithWorld((world) => {
    const app = world.context.app as express.Application;
    const auth = world.context.auth as Authentication;
    app.get('/test', auth.logout, (_req, res) => {
      res.send('success');
    });
    return request(app).get('/test').expect(200);
  })
);

Then(
  'logout removes the user',
  stepWithWorld((world) => {
    const app = world.context.app as express.Application;
    const auth = world.context.auth as Authentication;
    const logout = jest.fn();
    app.use('*', (req, _res, next) => {
      req.logout = logout;
      next();
    });
    app.get('/test', auth.logout, (_req, res) => {
      res.send('success');
    });
    return request(app)
      .get('/test')
      .expect(200)
      .then(() => expect(logout).toHaveBeenCalled);
  })
);

Then(
  /^I bootstrap passport with authentication type '(\w+)'$/,
  stepWhichUpdatesWorld((world, authType) => {
    const auth = bootstrapPassport(world.context.app as express.Application, {
      authentication: { type: authType as authenticationStrategies },
      ...proxyDefaults,
    });

    world.context.auth = auth;
    return world;
  })
);

Then(
  'an error is thrown',
  stepWithWorld((world) => {
    const {
      context: { error },
    } = world;

    expect(error).toBeTruthy();
  })
);

Fusion('bootstrap.feature');
