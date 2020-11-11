# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: log module

    Behaviours and capabilities provided by the log module

    Scenario: Returns with the expected HTTP response for a /log call
    Given a 'log_only' server configuration
    And I run an instance of the Strimzi-UI server
    When I make a 'get' request to '/log'
    Then I get the expected log response

    Scenario: Sets up the WebSocket connection on /log call
    Given a 'log_only' server configuration
    And I run an instance of the Strimzi-UI server
    And I enable WebSocket connections on the Strimzi-UI server
    When I make a WebSocket connection request to '/log'
    And I send a logging WebSocket message
    And I send a logging WebSocket message without a clientLevel
    And I send a logging WebSocket message that is not a JSON array
    And I send an unparsable string logging WebSocket message
    And I send a non-string logging WebSocket message
    And I close the WebSocket
    Then the WebSocket has received 5 messages
    And the WebSocket is closed