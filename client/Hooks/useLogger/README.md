# useLogger

This hook is responsible for storing and sending client log messages to the WebSocket listener on the server `/log` endpoint. It sets up the WebSocket connection using the URL in the logging context.

Logging and the websocket connection are enabled when the `LOGGING` query parameter exists in the URL. The value of the `LOGGING` query parameter is a regex that is used to determine which components and code are logged. For example, a URL like `https://localhost:3000?LOGGING=.*` will enable logging for all components, and a URL like `https://localhost:3000?LOGGING=Home|MyDiv` will enable logging for just the `Home` and `MyDiv` components.

To use this hook, the (`LoggingProvider`)[../../Contexts/Logging] context provider component must be rendered by an ancestor component. The `Logging` context stores the websocket client and the messages buffer used by this hook.

Usage of the hook must follow the (react hooks rules)[https://reactjs.org/docs/hooks-rules.html], but the logger callback returned by the hook can be used anywhere. For example:

```
const MyDiv = (props) => {
  const { debug, trace } = useLogger('MyDiv');
  debug(`Creating MyDiv component: ${{...props}}`);

  React.useEffect(() => {
    debug(`One-time interval set-up for MyDiv component`);
    setInterval(() => {
      trace('MyDiv component interval');
    }, 5000);
  }, []);

  return (<div {...props}/>);
};
```

## API

### `useLogger(componentName: string)`

The useLogger hook takes the name of the component, which appears in the server-side logs as `componentName`, and returns the `LoggerType` object containing the logging callbacks. The hook makes the connection to the the WebSocket listener on the server `/log` endpoint.

### `LoggerType` object

```
{
  log: (clientLevel: LogLevel, msg: string) => void;
  fatal: (msg: string) => void;
  error: (msg: string) => void;
  warn: (msg: string) => void;
  info: (msg: string) => void;
  debug: (msg: string) => void;
  trace: (msg: string) => void;
}
```

The `LoggerType` object includes a `log` function which has two arguments - the logging level, which can be `'fatal'`, `'error'`, `'warn'`, `'info'`, `'debug'` or `'trace'`, and determines the level at which the message is logged at the server; and a log message.

The other `LoggerType` functions each call the `log` function with the appropriate log level applied.
