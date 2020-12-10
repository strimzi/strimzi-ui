# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: client module

    Behaviours and capabilities provided by the client module

    Scenario Outline: If no <Asset> asset can be served, the client module returns 404
        Given a server with a 'client' configuration
        And There are no files to serve
        And I run an instance of the Strimzi-UI server
        When I make a 'get' request to '<Asset>'
        Then I get the expected status code '<StatusCode>' response

        Examples:
            | Asset               | StatusCode |
            | /index.html         | 404        |
            | /images/picture.svg | 404        |
            | /doesnotexist.html  | 404        |
            | /someroute          | 404        |
            | /protected.html     | 404        |
            | /                   | 404        |

    Scenario: Critical configuration is templated into index.html so the client can bootstrap
        Given a server with a 'client' configuration
        And There are files to serve
        And authentication type 'none' is required
        And I run an instance of the Strimzi-UI server
        When I make a 'get' request to '/index.html'
        Then the file is returned as with the expected configuration included

    Scenario Outline: With no authentication, the client module returns the appropriate <StatusCode> return code for a request of <Asset>
        Given a server with a 'client' configuration
        And There are files to serve
        And authentication type 'none' is required
        And I run an instance of the Strimzi-UI server
        When I make a 'get' request to '<Asset>'
        Then I get the expected status code '<StatusCode>' response
        # if the route (not file) is not matched, we redirect to /. Hence /someroute response
        Examples:
            | Asset               | StatusCode |
            | /index.html         | 200        |
            | /images/picture.svg | 200        |
            | /doesnotexist.html  | 404        |
            | /someroute          | 302        |
            | /protected.html     | 200        |
            | /                   | 200        |

    Scenario Outline: With scram authentication, the client module returns the appropriate <StatusCode> return code for an unauthenticated request of <Asset>
        Given a server with a 'client' configuration
        And There are files to serve
        And authentication type 'scram' is required
        And I run an instance of the Strimzi-UI server
        When I make a 'get' request to '<Asset>'
        Then I get the expected status code '<StatusCode>' response
        # if the route is protected we redirect to login, and if the route isn't matched we redirect to /
        Examples:
            | Asset               | StatusCode |
            | /index.html         | 302        |
            | /images/picture.svg | 200        |
            | /doesnotexist.html  | 404        |
            | /someroute          | 302        |
            | /protected.html     | 302        |
            | /                   | 302        |


    Scenario Outline: With scram authentication, the client module returns the appropriate <StatusCode> return code for an authenticated request of <Asset> when I am logged in
        Given a server with a 'client' configuration
        And a 'security' module
        And There are files to serve
        And authentication type 'scram' is required
        And the scram authentication accepts credentials
        And I run an instance of the Strimzi-UI server
        And all requests use the same session
        When I send credentials to endpoint '/auth/login'
        And I make a 'get' request to '<Asset>'
        Then I get the expected status code '<StatusCode>' response
        # if the route (not file) is not matched, we redirect to /. Hence /someroute response
        Examples:
            | Asset               | StatusCode |
            | /index.html         | 200        |
            | /images/picture.svg | 200        |
            | /doesnotexist.html  | 404        |
            | /someroute          | 302        |
            | /protected.html     | 200        |
            | /                   | 200        |
