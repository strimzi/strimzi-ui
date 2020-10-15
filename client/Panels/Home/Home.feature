# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: Home component

  Scenario: Basic rendering
    Given a Home component
    When it is rendered
    Then it should display text