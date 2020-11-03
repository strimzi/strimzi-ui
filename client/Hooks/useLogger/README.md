# useLogger

This hook is responsible for storing and sending client log messages to the WebSocket listener on
the server `/log` endpoint. It sets up the WebSocket connection using the URL in
the logging context.

Usage of the hook must follow the (react hooks rules)[https://reactjs.org/docs/hooks-rules.html],
but the logger callback returned by the hook can be used anywhere. For example:

```
const MyDiv = (props) => {
  const log = useLogger('MyDiv');
  log('debug', `Creating MyDiv component: ${{...props}}`);

  React.useEffect(() => {
    log('debug', `One-time interval set-up for MyDiv component`);
    setInterval(() => {
      log('trace', 'MyDiv component interval');
    }, 5000);
  }, []);

  return (<div {...props}/>);
};
```

## API

### `userLogger(componentName: string)`

The useLogger hook takes the name of the component, which appears in the server-side logs as `componentName`,
and returns the logger callback.

### `loggerCallback(level: string, message: string)`

The logger callback takes the logging level, which can be `'fatal'`, `'error'`, `'warn'`, `'info'`, `'debug'` or `'trace'`,
and determines the level at which the message is logged at the server; and a log message.
