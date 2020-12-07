# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: Strategy Factory

  Scenario Outline: Strategies are returned of the expected type

    When a strategy factory is asked for type '<type>'
    Then the returned strategy is of type '<expected>'
    Examples:
      | type    | expected |
      | scram   | scram    |
      | oauth   | oauth    |
      | none    | none     |
      | unknown | none     |