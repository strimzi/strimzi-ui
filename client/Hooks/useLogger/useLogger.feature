
# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: useLogger hook

  Scenario: Basic useLogger connection and logging
    Given a logging WebSocket server
    And the LOGGING query param is set to '.*'
    When the useLogger hook is rendered
    And 1 trace-level message is logged
    Then the useLogger hook is connnected to the WebSocket server
    And 1 trace-level logging message is received by the WebSocket server

  Scenario: Logging when useLogger is already connected
    Given a logging WebSocket server
    And the LOGGING query param is set to '.*'
    When the useLogger hook is rendered
    And the useLogger hook is connnected to the WebSocket server
    And 1 debug-level message is logged
    Then 1 debug-level logging message is received by the WebSocket server

  Scenario: Message buffer is truncated when useLogger is not yet connected
    Given a logging WebSocket server
    And the LOGGING query param is set to '.*'
    When the useLogger hook is rendered
    And 110 info-level messages are logged
    And the useLogger hook is connnected to the WebSocket server
    Then 100 info-level logging messages are received by the WebSocket server

  Scenario: Re-rendering useLogger when it is already connected
    Given a logging WebSocket server
    And the LOGGING query param is set to '.*'
    When the useLogger hook is rendered
    And the useLogger hook is connnected to the WebSocket server
    And 1 warn-level message is logged
    And 1 warn-level logging message is received by the WebSocket server
    And the useLogger hook is re-rendered
    And 1 warn-level message is logged
    Then 1 warn-level logging message is received by the WebSocket server

  Scenario: Re-rendering useLogger when it is not yet connected
    Given a logging WebSocket server
    And the LOGGING query param is set to '.*'
    When the useLogger hook is rendered
    And 1 error-level message is logged
    And the useLogger hook is re-rendered
    And 1 error-level message is logged
    And the useLogger hook is connnected to the WebSocket server
    Then 2 error-level logging messages are received by the WebSocket server

  Scenario: No connection or logging with a non-matching componentName
    Given a logging WebSocket server
    And the LOGGING query param is set to 'not-found'
    When the useLogger hook is rendered
    And 1 fatal-level message is logged
    Then the useLogger hook does not connnect to the WebSocket server

  Scenario: No connection or logging when the LOGGING query param is not set
    Given a logging WebSocket server
    When the useLogger hook is rendered
    And 1 fatal-level message is logged
    Then the useLogger hook does not connnect to the WebSocket server

  Scenario: No connection or logging when the LOGGING query param is empty
    Given a logging WebSocket server
    And the LOGGING query param is set to ''
    When the useLogger hook is rendered
    And 1 fatal-level message is logged
    Then the useLogger hook does not connnect to the WebSocket server

  Scenario: Handling a WebSocket connection error
    Given a logging WebSocket server
    And the LOGGING query param is set to '.*'
    When the useLogger hook is rendered
    And the useLogger hook is connnected to the WebSocket server
    And 1 info-level message is logged
    And the WebSocket server rejects the useLogger connection
    Then the useLogger hook is disconnnected from the WebSocket server

  Scenario: Basic useLogger secured connection and logging
    Given a secure logging WebSocket server
    And the LOGGING query param is set to '.*'
    When the useLogger hook is rendered
    And 1 trace-level message is logged
    Then the useLogger hook is connnected to the WebSocket server
    And 1 trace-level logging message is received by the WebSocket server

