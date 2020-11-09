/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { RouterConfig, PageConfig, Page, Leaf } from 'Hooks/types';

const isTopLevelNav = (path) => path.match(/\//g).length === 1;

const extractTopLevelPath = (path) => path.match(/\/[^/]*/g)[0];

const generateKey = (name, prefix, properties) =>
  `${prefix}-${name.replace(/ /g, '')}${
    properties && properties.mode ? `.${properties.mode}` : ''
  }`;

const useRouteConfig = (input: PageConfig): RouterConfig => {
  const output: RouterConfig = {
    links: [],
    routes: [],
    meta: {},
  };

  const leaves: Array<Leaf> = [];

  Object.values(input).map((value) => {
    const page = value as Page;
    const contexts = page.contexts;

    contexts.map((context) => {
      // TRANSLATE THIS ONCE 188N IS IN
      const translatedName = context.name;
      const linkKey = generateKey(translatedName, 'link', context.properties);
      const routeKey = generateKey(translatedName, 'route', context.properties);

      if (isTopLevelNav(context.path)) {
        output.links.push({
          to: context.path,
          key: linkKey,
          children: translatedName,
        });
      } else {
        leaves.push({
          parent: extractTopLevelPath(context.path),
          child: {
            path: context.path,
            name: translatedName,
          },
        });
      }

      output.routes.push({
        path: context.path,
        key: routeKey,
        componentForRoute: page.contentComponent,
      });

      output.meta[context.path] = {
        name: translatedName,
        pageType: context.pageType,
        order: context.order,
        properties: context.properties ? context.properties : {},
        isTopLevel: isTopLevelNav(context.path),
        icon: context.icon,
        leaves: [],
      };
    });
  });

  leaves.map((leaf) => {
    if (output.meta[leaf.parent]) {
      output.meta[leaf.parent].leaves.push(leaf.child);
    }
  });

  return output;
};

export { useRouteConfig };
