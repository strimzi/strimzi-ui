# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: mockapi module

    Behaviours and capabilities provided by the mockapi module

    Scenario: Returns with the expected response for a mocked api call
    Given a 'mockapi_only' server configuration
    And I run an instance of the Strimzi-UI server
    When I make a 'get' request to '/api/foo'
    Then I get the expected mockapi response

    Scenario: Returns with the expected response for a call to the test endpoint
    Given a 'mockapi_only' server configuration
    And I run an instance of the Strimzi-UI server
    When I make a 'get' request to '/api/test'
    Then I get the expected mockapi test endpoint response