# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: strimzi-ui server

    Tests to cover the bootstrap and high level logic around the strimzi-ui server

    Scenario: The server bootstraps as expected when it is not given any/missing configuration
    Given no server configuration file
    When I start the server
    Then the server starts

    Scenario: The server bootstraps as expected given a secured configuration
    Given an https configuration file
    When I start the server
    Then the server starts

    Scenario: The server bootstraps as expected given a non secured configuration
    Given an http configuration file
    When I start the server
    Then the server starts

    Scenario: The reloads module configuration/state when the configuration file changes
    Given a starting configuration file
    When I start the server
    Then the server starts
    And I make a configuration change
    Then the server reflects that configuration change
