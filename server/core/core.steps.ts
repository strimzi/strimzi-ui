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
  stepWithWorld((world) => {
    const { request } = world;
    return request.expect('x-strimzi-ui-request', /^.{16}$/).expect(418);
  })
);

Then(
  'the unique request header sent is returned in the response',
  stepWithWorld((world) => {
    const { request, context } = world;
    return request
      .expect('x-strimzi-ui-request', context.requestId as string)
      .expect(418);
  })
);

Then(
  'all expected security headers are present',
  stepWithWorld((world) => {
    const { request } = world;
    const chainedRequest = request.expect(
      (res) => res.headers['x-powered-by'] === undefined
    );
    // object with all expected headers and values
    const headerExpectedValue = {
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

    return Object.entries(headerExpectedValue).reduce(
      (request, [key, value]) => request.expect(key, value as string),
      chainedRequest
    );
  })
);

Then(
  'the mockapi handler is called',
  stepWithWorld((world) => {
    const { request } = world;
    // check/confirm the test header is present - only applied by mockapi's test handler, meaning the api module did not fire
    return request.expect('x-strimzi-ui-module', 'mockapi');
  })
);

Then(
  /^the response sets a cookie named '(\S+)'$/,
  stepWithWorld((world, cookieName) => {
    const { request } = world;
    return request.expect('set-cookie', new RegExp(`${cookieName}=\\S+`));
  })
);

Fusion('core.feature');
