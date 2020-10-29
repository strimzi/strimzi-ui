# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: config module

    Behaviours and capabilities provided by the config module

    Scenario: Returns with the expected response for a config call
    Given a 'config_only' server configuration
    And I run an instance of the Strimzi-UI server
    When I make a 'get' request to '/config'
    Then I get the expected config response