# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: Security module

  Scenario: SCRAM - authenticate valid credentials

    Given a server with a 'security' configuration
    And authentication type 'scram' is required
    And I run an instance of the Strimzi-UI server
    And the scram authentication accepts credentials
    When I send credentials to endpoint '/auth/login'
    Then I get the expected status code '200' response

  Scenario: SCRAM - authenticate invalid credentials

    Given a server with a 'security' configuration
    And authentication type 'scram' is required
    And I run an instance of the Strimzi-UI server
    And the scram authentication rejects credentials
    When I send credentials to endpoint '/auth/login'
    Then I get the expected status code '401' response

  Scenario: SCRAM - login page

    Given a server with a 'security' configuration
    And authentication type 'scram' is required
    And I run an instance of the Strimzi-UI server
    When I make a 'get' request to '/auth/login'
    Then I get the expected status code '200' response and body 'This will later be the login page'


  Scenario: SCRAM - logout
    Given a server with a 'security' configuration
    And authentication type 'scram' is required
    And I run an instance of the Strimzi-UI server
    And the scram authentication accepts credentials
    When I make a 'post' request to '/auth/logout'
    Then I get the expected status code '200' response

  Scenario: Off - authenticate

    Given a server with a 'security' configuration
    And authentication type 'none' is required
    And I run an instance of the Strimzi-UI server
    When I send credentials to endpoint '/auth/login'
    Then I get the expected status code '404' response

  Scenario: Off - login route

    Given a server with a 'security' configuration
    And authentication type 'none' is required
    And I run an instance of the Strimzi-UI server
    When I send credentials to endpoint '/auth/login'
    Then I get the expected status code '404' response

  Scenario: Off - logout

    Given a server with a 'security' configuration
    And authentication type 'none' is required
    And I run an instance of the Strimzi-UI server
    When I make a 'post' request to '/auth/logout'
    Then I get the expected status code '404' response
