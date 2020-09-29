# core

This module represents the core Express server. It also imports, configures and provides common items and capabilities to all modules, such as an authentication check middleware and logging utilities, as well as common middleware and security features.

## Public api

The core `app.js` file (in place of `router.js`) exports one function, `returnExpress`. This function takes one parameter, being a callback to get the current configuration. This is expected to be used in `main.js` to bind the returned express app to an http(s) server.

## Interaction with other modules

The core module will import and interact with all other modules to implement the server at run time. Thus, there are two

### Import time

The core module will import all modules' default export. This is expected to be a function, which takes two parameters:

```
const [mountPoint, routerToMount] = myModule(authMiddleware, router);
```

Where:

- `authMiddleware` is an express middleware function to be inserted/used when a module's routes require a user to be authenticated to access them
- `router` is an express [Router](https://expressjs.com/en/4x/api.html#router), which this module will append handlers to. This is provided so a common, pre module handler piece of express middleware can run [as described at runtime](#run-time) to provide context to the module

This function is to return an array containing two items. The first is the context route this module will be mounted on (eg `/dev`). The second is the modified router, with handlers appended to it.

This will then be mounted to the express server, ready to serve requests at runtime.

### Run time

At runtime, before any module handlers are called, a piece of express middleware defined by the core module will run. The result of this middleware is as follows:

- Create a context object in `res.locals` called `strimziuicontext`. This context will contain:
  - The current configuration for the server
  - A unique request ID
  - A pre configured set of loggers to use
- Perform a check when receiving the request to see if the module is enabled, and thus should respond. If it is not enabled, a HTTP 404 RC will be returned, and the module's handlers will not be invoked

_Note_: Implementation to follow in a future PR
