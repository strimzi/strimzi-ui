# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: Scram Authenticator

  Scenario Outline: Accepts a valid username and password
    Given an authentication endpoint of 'https://strimzi-admin'
    And the authentication endpoint accepts username '<username>' and password '<password>'
    When a verify callback is generated
    And I call verify with username '<username>' and password '<password>'
    Then the callback should return a user with username '<username>' and a token

    Examples:
      | username  | password |
      | test-user | test-pw  |

  Scenario: Rejects an invalid username and password
    Given an authentication endpoint of 'https://strimzi-admin'
    And the authentication endpoint refuses any credentials
    When a verify callback is generated
    And I call verify with username 'username' and password 'password'
    Then the callback should return 'false'

  Scenario: Rejects when unable to authenticate
    Given an authentication endpoint of 'https://strimzi-admin'
    And the authentication endpoint returns a server error
    When a verify callback is generated
    And I call verify with username 'username' and password 'password'
    Then the callback should return an error