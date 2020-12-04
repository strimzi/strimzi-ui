
# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: Topics panel

  Scenario: Seeing all available topics:
    Given a Topics panel component
    When it is rendered
    Then I see all topics

  Scenario: Viewing a specific topic (when it exists in the cluster):
    Given a Topics panel component
    When it is rendered
    And I filter for topic 'testtopic1'
    Then I see topic 'testtopic1' in the topic list
