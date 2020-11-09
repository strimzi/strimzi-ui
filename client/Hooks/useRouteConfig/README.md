# useRouteConfig

This hook is used to convert a page configuration into a usuable React-router configuration.

[View the navigation docs for full details on what it does](/client/Bootstrap/Navigation/README.md#route-configuration-processing).

## Usage

```ts

import { useRouteConfig } from 'Hooks';
import { RouterConfig, PageConfig } from 'Hooks/types';

const myComponent = () => {
  const pageConfig: PageConfig = {...}
  const routerConfig: RouterConfig = useRouteConfig(pageConfig);
}
```
