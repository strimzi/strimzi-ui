# sanatise

A set of helper functions to sanatise/validate user input before said input is used across the UI.

## Functions available

- `sanatiseUrlParams` - takes a given URL parameter type, eg `window.search`, and returns an object containing key value pairs of those parameters. If either the key or value do not pass a sanatisation check, they will be omitted from the returned object. Allowed characters are alphanumeric, as well as `.`,`,`,`_`,`-` and `=` characters.

Example usage, where `window.search` is `param=true&param2=false<evil>&foo<evil2>=true`:

```
...
import {sanatiseUrlParams} from 'utils/sanatise'
...
const { param, param2, foo } = sanatiseUrlParams(window.search);
...

```

In this case, `param2` and `foo` will be undefined, as it's key/value contained unsafe characters (`<`, `>`).
