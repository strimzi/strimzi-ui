# Testing i18n

When testing React components, it can be desirable to check for the presence of a string in the output. However, for test purposes we do not care about the actual string (we trust that `react-i18next` library works.)

Instead, we just need to assert that the correct translation key, formatting elements and inserts are used.

This module exports two functions:

`translate` - that takes in two parameters `key` and `inserts` - and returns a string with the following format:

```
key:"$key" inserts:{"key": "value"}
```

`translateWithFormatting` - that takes in two parameters `key` and `children` - where children can be one or many React Nodes or key:value pairs. It returns a string with the following format:

```
key:"$key" elements:[...<element prop1="" prop 2=""/>] inserts:[{"key": "value"}]
```

These can then be used by any `react-i18next` mock in tests to create a fake translation. It can also be used in RTL tests to assert that the expected text exists in the document.
