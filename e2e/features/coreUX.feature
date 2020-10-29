# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: Strimzi-ui core UX

Scenario: When a user accesses the Strimzi-ui, they see the home page
    Given I am on the strimzi-ui homepage
    Then the welcome message appears