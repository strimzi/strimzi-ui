# client

This module is responsible for serving the built client code, and does so on the `/` context root. All built client files are considered 'public', ie can be accessed without an authentication check, except a set defined subset representing the bundles which will only be retrieved once a user has authenticated and/or the backend server can support the page(s) those bundles represent. It also includes a behaviour if a request is not matched/served, it will redirect to `/index.html`.

_Note_: Implementation to follow in a future PR
