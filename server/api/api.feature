# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: api module

    Behaviours and capabilities provided by the api module

    Scenario: Proxies all requests made to /api to the configured backend
        Given a server with a 'api' configuration
        And I run an instance of the Strimzi-UI server
        When I make a 'get' request to '/api/foo'
        Then I make the expected proxy request and get the expected proxied response

    Scenario: Proxies all requests made to /api to the securley configured backend
        Given a server with a 'api_secured' configuration
        And I run an instance of the Strimzi-UI server
        When I make a 'get' request to '/api/foo'
        Then I make the expected proxy request and get the expected proxied response

    Scenario: Handles errors from the proxied backend gracefully
        Given a server with a 'api_secured' configuration
        And the backend proxy returns an error response
        And I run an instance of the Strimzi-UI server
        When I make a 'get' request to '/api/foo'
        Then I make the expected proxy request and get the expected proxied response

    Scenario: Proxies all requests made to /api to the specified context root
        Given a server with a 'api_with_custom_context_root' configuration
        And I run an instance of the Strimzi-UI server
        When I make a 'get' request to '/api/foo'
        Then I make the expected proxy request and get the expected proxied response