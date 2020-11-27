# Test utilities

Common helper code used under test. See individual directories for details of the helpers. All are expected to be publicly exported via the `index.ts` barrel file in this directory, so test code can reference them as follows:

```
...
import { renderWithContextProviders } from 'utils/test';
...
```

## Provided utilities

- [Context](./context/README.md) - utilities for writing tests for components that use contexts.
- [i18n](./i18n/README.md) - i18n test helpers
- [withApollo](./withApollo/README.md) - Apollo client helper utilities
