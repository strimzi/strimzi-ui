# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: log module

    Behaviours and capabilities provided by the log module

    Scenario: Returns with the expected response for a /log call
    Given a 'log_only' server configuration
    And I run an instance of the Strimzi-UI server
    When I make a 'get' request to '/log'
    Then I get the expected log response