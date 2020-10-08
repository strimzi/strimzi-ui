# client

This module is responsible for serving the built client code, and does so on the `/` context root. Given the number of built files, and that some files represent pages that require privileged access, an include list of `public` files, I.e files any user could access without need of authentication, is defined in the `controller` as `publicFiles`. All other files will require a user to pass the authentication challenge. Examples of `public` files include images, fonts, as well as `index.html` as the bootstrap for the client.

It also includes a behaviour if a request is not matched/served, it will redirect to `/index.html`, as long as an `index.html` file is present in the built output.
