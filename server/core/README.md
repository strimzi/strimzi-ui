# core

This module represents the core Express server. It also imports, configures and provides common items and capabilities to all modules, such as an authentication check middleware and logging utilities, as well as common middleware and security features.

## Public api

The core `app.ts` file (in place of `router.ts`) exports one function, `returnExpress`. This function takes one parameter, being a callback to get the current configuration. This is expected to be used in `main.ts` to bind the returned express app to an http(s) server.

## Interaction with other modules

The core module will import and interact with all other modules to implement the server at run time. Thus, there are two points where the core module will interact with the other modules. These are detailed below.

### Import time

The core module will import all modules' default export. The export is expected to contain two keys - `moduleName` and `addModule`, as per the `UIServerModule` interface. `addModule` is expected to be a function, which takes the following parameters:

```
const { mountPoint, routerFromModule } = myModule(logGenerator, authMiddleware, serverConfig);
```

Where:

- `logGenerator` is a function which will return a logger to be used in `addModule` only to trace entry, exit and any helpful diagnostics while this module mounts
- `authMiddleware` is an express middleware function to be inserted/used when a module's routes require a user to be authenticated to access them
- `serverConfig` is the server's configuration at start up. If your module requires configuration at mount, it can be accessed here.

This function is to return an object containing two items. The first is the context route this module will be mounted on (eg `/dev`). The second is an express [Router](https://expressjs.com/en/4x/api.html#router), which this module will have appended it's handlers to.

This router will be invoked when enabled by the core express server, allowing the registered handlers on the router to then handle the request.

### Run time

At runtime, before any module handlers are called, a piece of express middleware defined by the core module will run. The result of this middleware is as follows:

- Create a context object in `res.locals` called `strimziuicontext`. This context will contain:
  - The current configuration for the server
  - A unique request ID
  - A pre configured set of loggers to use for the current module
- Perform a check when receiving the request to see if the module is enabled, and thus should respond. If it is not enabled, the router for the module will not be invoked, and will try the next registered router.

In the event two modules register a handler for the same route (E.g `/foo/bar`), the first module registered will have it's handler(s) called.
