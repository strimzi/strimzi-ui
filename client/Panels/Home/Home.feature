# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: Home component

  Scenario: Basic rendering
    Given a Home component
    When it is rendered
    Then it should display the expected text

  Scenario: Basic rendering without version
    Given a Home component
    When it is rendered with no version
    Then it should display the expected text