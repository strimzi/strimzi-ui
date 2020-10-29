# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: core module

    Behaviours and capabilities provided by the core module

    Scenario: When making a call with no strimzi-ui header, one is added for later requests
    Given a 'mockapi_only' server configuration
    And I run an instance of the Strimzi-UI server
    When I make a request with no unique request header
    Then a unique request header is returned in the response

    Scenario: When making a call with a strimzi-ui header, that header is used in the request
    Given a 'mockapi_only' server configuration
    And I run an instance of the Strimzi-UI server
    When I make a request with a unique request header
    Then the unique request header sent is returned in the response

    Scenario: When making a call to the strimzi-ui server, the expected secuirty headers are present
    Given a 'mockapi_only' server configuration
    And I run an instance of the Strimzi-UI server
    When I make a 'get' request to '/api/test'
    Then all expected security headers are present

    Scenario: If two modules mount routes on the same mounting point, and one is disabled, the enabled module is invoked
    Given a 'mockapi_only' server configuration
    And I run an instance of the Strimzi-UI server
    When I make a 'get' request to '/api/test'
    Then the mockapi handler is called