/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { When, Then, Fusion } from 'jest-cucumber-fusion';
import {
  stepWhichUpdatesWorld,
  stepWithWorld,
} from 'test_common/commonServerSteps';

When(
  'I make a request with no unique request header',
  stepWhichUpdatesWorld((world) => {
    const { server } = world;
    return {
      ...world,
      request: server.get('/api/test'),
    };
  })
);

When(
  'I make a request with a unique request header',
  stepWhichUpdatesWorld((world) => {
    const { server, context } = world;
    const ID = 'HelloWorld';
    return {
      ...world,
      request: server.get('/api/test').set('x-strimzi-ui-request', ID),
      context: {
        ...context,
        requestId: ID,
      },
    };
  })
);

Then(
  'a unique request header is returned in the response',
  stepWithWorld(async (world) => {
    const { request } = world;
    await request.then(
      (res) => {
        const { headers, status } = res;
        const idHeaderValue = headers['x-strimzi-ui-request'];
        expect(idHeaderValue).not.toBeUndefined();
        expect(idHeaderValue.length).toBe(16);
        expect(status).toBe(418);
      },
      (err) => {
        throw err;
      }
    );
  })
);

Then(
  'the unique request header sent is returned in the response',
  stepWithWorld(async (world) => {
    const { request, context } = world;
    await request.then(
      (res) => {
        const { headers, status } = res;
        const idHeaderValue = headers['x-strimzi-ui-request'];
        expect(idHeaderValue).not.toBeUndefined();
        expect(idHeaderValue).toEqual(context.requestId);
        expect(status).toBe(418);
      },
      (err) => {
        throw err;
      }
    );
  })
);

Then(
  'all expected security headers are present',
  stepWithWorld(async (world) => {
    const { request } = world;
    await request.then(
      (res) => {
        const { headers } = res;
        // object with all expected headers and values
        const headerExpectedValue = {
          'x-powered-by': undefined, // no powered by header
          'x-xss-protection': '0', // disable XSS auditor in browser, superseded by content-security-policy
          'x-frame-options': 'SAMEORIGIN', // prevents clickjacking - only allows the rendering/use of returned content in a frame with the same origin
          'strict-transport-security': 'max-age=15552000; includeSubDomains', // tell the browser to prefer/use HTTPS over HTTP where possible
          'x-download-options': 'noopen', // for older browsers, do not trigger downloads
          'x-content-type-options': 'nosniff', // prevent mime checking/sniffing
          'x-permitted-cross-domain-policies': 'none', // defines a location where a policy configuration could be retrieved for some clients to access content across multiple domains. Disabled here.
          'content-security-policy':
            "default-src 'self';base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
          'x-dns-prefetch-control': 'off', // CSP to help prevent cross site scripting by restricting all content to come from 'here' (self)
          'expect-ct': 'max-age=0', // allow the checking of/confirm certificates used are used correctly
          'referrer-policy': 'no-referrer', // remove the previously visited/linked location
        };

        Object.entries(headerExpectedValue).forEach(([key, value]) =>
          expect(headers[key]).toEqual(value)
        );
      },
      (err) => {
        throw err;
      }
    );
  })
);

Then(
  'the mockapi handler is called',
  stepWithWorld(async (world) => {
    const { request } = world;
    await request.then(
      (res) => {
        const { headers } = res;
        // check/confirm the test header is present - only applied by mockapi's test handler, meaning the api module did not fire
        expect(headers['x-strimzi-ui-module']).toBe('mockapi');
      },
      (err) => {
        throw err;
      }
    );
  })
);

Fusion('core.feature');
