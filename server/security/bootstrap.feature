# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: Bootstrapping passport

  Scenario: Check auth function when not authenticated
    Given an Application
    When I bootstrap passport with authentication type 'scram'
    Then check auth redirects to '/auth/login'

  Scenario: Check auth function when authenticated - Scram
    Given an Application
    When I bootstrap passport with authentication type 'scram'
    And the request is authenticated
    Then check auth returns '200'

  Scenario: Check auth function - No auth
    Given an Application
    When I bootstrap passport with authentication type 'none'
    Then check auth returns '200'

  Scenario: Logout function - Scram
    Given an Application
    When I bootstrap passport with authentication type 'scram'
    Then logout removes the user

  Scenario: Logout function - No auth
    Given an Application
    When I bootstrap passport with authentication type 'none'
    Then logout returns '200'

  Scenario: Unsupported auth type
    Given an Application
    When I bootstrap passport with authentication type 'unsupported'
    Then an error is thrown
