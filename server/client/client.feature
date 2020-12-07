# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: client module

    Behaviours and capabilities provided by the client module

    Scenario Outline: With auth '<Auth>' - If no <Asset> asset can be served, the client module returns 404
        Given a server with a 'client' configuration
        And There are no files to serve
        And '<Auth>' authentication is required
        And I run an instance of the Strimzi-UI server
        When I make a 'get' request to '<Asset>'
        Then I get the expected status code '<StatusCode>' response
        Examples:
            | Asset               | Auth  | StatusCode |
            | /index.html         | scram | 404        |
            | /images/picture.svg | scram | 404        |
            | /doesnotexist.html  | scram | 404        |
            | /someroute          | scram | 404        |
            | /protected.html     | scram | 404        |
            | /                   | scram | 404        |
            | /index.html         | oauth | 404        |
            | /images/picture.svg | oauth | 404        |
            | /doesnotexist.html  | oauth | 404        |
            | /someroute          | oauth | 404        |
            | /protected.html     | oauth | 404        |
            | /                   | oauth | 404        |
            | /index.html         | none  | 404        |
            | /images/picture.svg | none  | 404        |
            | /doesnotexist.html  | none  | 404        |
            | /someroute          | none  | 404        |
            | /protected.html     | none  | 404        |
            | /                   | none  | 404        |

    Scenario Outline: With auth '<Auth>' - if assets can be served, the client module returns the appropriate <StatusCode> return code for a request of <Asset>
        Given a server with a 'client' configuration
        And a 'security' module
        And There are files to serve
        And '<Auth>' authentication is required
        And I run an instance of the Strimzi-UI server
        When I make a 'get' request to '<Asset>'
        Then I get the expected status code '<StatusCode>' response
        # if the route (not file) is not matched, we render index.html as the response (200)
        Examples:
            | Asset               | Auth  | StatusCode |
            | /index.html         | scram | 302        |
            | /images/picture.svg | scram | 200        |
            | /doesnotexist.html  | scram | 302        |
            | /someroute          | scram | 302        |
            | /protected.html     | scram | 302        |
            | /                   | scram | 302        |
            | /index.html         | oauth | 302        |
            | /images/picture.svg | oauth | 200        |
            | /doesnotexist.html  | oauth | 302        |
            | /someroute          | oauth | 302        |
            | /protected.html     | oauth | 302        |
            | /                   | oauth | 302        |
            | /index.html         | none  | 200        |
            | /images/picture.svg | none  | 200        |
            | /doesnotexist.html  | none  | 200        |
            | /someroute          | none  | 200        |
            | /protected.html     | none  | 200        |
            | /                   | none  | 200        |

    Scenario: Critical configuration is templated into index.html so the client can bootstrap
        Given a server with a 'client' configuration
        And There are files to serve
        And I run an instance of the Strimzi-UI server
        When I make a 'get' request to '/index.html'
        Then the file is returned as with the expected configuration included
