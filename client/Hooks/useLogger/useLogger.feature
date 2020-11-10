
# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: useLogger hook

  Scenario: Basic useLogger connection and logging
    Given a logging WebSocket server
    When the useLogger hook is rendered
    And 1 message is logged
    Then the useLogger hook is connnected to the WebSocket server
    And 1 logging message is received by the WebSocket server

  Scenario: Logging when useLogger is already connected
    Given a logging WebSocket server
    When the useLogger hook is rendered
    And the useLogger hook is connnected to the WebSocket server
    And 1 message is logged
    Then 1 logging message is received by the WebSocket server

  Scenario: Message buffer is truncated when useLogger is not yet connected
    Given a logging WebSocket server
    When the useLogger hook is rendered
    And 110 messages are logged
    And the useLogger hook is connnected to the WebSocket server
    Then 100 logging messages are received by the WebSocket server

  Scenario: Re-rendering useLogger when it is already connected
    Given a logging WebSocket server
    When the useLogger hook is rendered
    And the useLogger hook is connnected to the WebSocket server
    And 1 message is logged
    And 1 logging message is received by the WebSocket server
    And the useLogger hook is re-rendered
    And 1 message is logged
    Then 1 logging message is received by the WebSocket server

  Scenario: Re-rendering useLogger when it is not yet connected
    Given a logging WebSocket server
    When the useLogger hook is rendered
    And 1 message is logged
    And the useLogger hook is re-rendered
    And 1 message is logged
    And the useLogger hook is connnected to the WebSocket server
    Then 2 logging messages are received by the WebSocket server

  Scenario: Connection and logging with a non-matching componentName
    Given a logging WebSocket server
    When the useLogger hook is rendered with an empty componentName
    And 1 message is logged
    Then the useLogger hook does not connnect to the WebSocket server

  Scenario: Handling a WebSocket connection error
    Given a logging WebSocket server
    When the useLogger hook is rendered
    And the useLogger hook is connnected to the WebSocket server
    And 1 message is logged
    And the WebSocket server rejects the useLogger connection
    Then the useLogger hook is disconnnected from the WebSocket server
