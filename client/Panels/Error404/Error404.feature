# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: Error 404 component

  Scenario: Basic rendering
    Given a Error404 component
    When it is rendered
    Then it should display text