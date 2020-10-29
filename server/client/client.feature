# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: client module

    Behaviours and capabilities provided by the client module

    Scenario Outline: If no <Asset> asset can be served, the client module returns 404
    Given a 'client_only' server configuration
    And There are no files to serve
    And Authentication is required
    And I run an instance of the Strimzi-UI server
    When I make a 'get' request to '<Asset>'
    Then I get the expected status code '<StatusCode>' response

    Examples:
    | Asset                 | StatusCode    |
    | /index.html           | 404           |
    | /images/picture.svg   | 404           |
    | /doesnotexist.html    | 404           |
    | /someroute            | 404           |
    | /protected.html       | 404           |
    | /                     | 404           |

    Scenario Outline: If assets can be served, the client module returns the appropriate <StatusCode> return code for a request of <Asset>
    Given a 'client_only' server configuration
    And There are files to serve
    And Authentication is required
    And I run an instance of the Strimzi-UI server
    When I make a 'get' request to '<Asset>'
    Then I get the expected status code '<StatusCode>' response
    # if the route (not file) is not matched, we redirect to index.html. Hence / and someroute response
    Examples:
    | Asset                 | StatusCode    |
    | /index.html           | 200           |
    | /images/picture.svg   | 200           |
    | /doesnotexist.html    | 404           |
    | /someroute            | 302           |
    | /protected.html       | 511           |
    | /                     | 200           |
