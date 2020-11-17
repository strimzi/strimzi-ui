/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { RouterConfig, PageConfig, Page, Leaf } from './useRouteConfig.types';
import mergeWith from 'lodash.mergewith';

const isTopLevelNav = (path) => path.split('/').length === 2;

const extractTopLevelPath = (path) => path.split('/')[1];

const generateKey = (name, prefix, properties) =>
  `${prefix}-${removeWhitespace(removePathVars(name))}${
    properties && properties.mode ? `.${properties.mode}` : ''
  }`;

const removeWhitespace = (name) => name.replace(/\s/g, '');

const removePathVars = (name) => name.replace(/\${[^}]*\}/g, '');

const contextReducer = (acc, context, page, leaves) => {
  // TRANSLATE THIS ONCE 188N IS IN
  const translatedName = context.name;
  const linkKey = generateKey(translatedName, 'link', context.properties);
  const routeKey = generateKey(translatedName, 'route', context.properties);

  if (isTopLevelNav(context.path)) {
    acc.links.push({
      to: context.path,
      key: linkKey,
      children: translatedName,
    });
  } else {
    leaves.push({
      parent: `/${extractTopLevelPath(context.path)}`,
      child: {
        path: context.path,
        name: translatedName,
      },
    });
  }

  acc.routes.push({
    path: context.path,
    key: routeKey,
    componentForRoute: page.contentComponent,
  });

  acc.meta[context.path] = {
    name: translatedName,
    pageType: context.pageType,
    order: context.order,
    properties: context.properties ? context.properties : {},
    isTopLevel: isTopLevelNav(context.path),
    icon: context.icon,
    leaves: [],
  };

  return acc;
};

const mergeReduce = (acc, cur) =>
  mergeWith(acc, cur, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  });

const useRouteConfig = (input: PageConfig): RouterConfig => {
  const leaves: Array<Leaf> = [];
  const output = Object.values(input)
    .map((value) => {
      const page = value as Page;
      const contexts = page.contexts;

      return contexts.reduce(
        (acc, context) => contextReducer(acc, context, page, leaves),
        {
          links: [],
          routes: [],
          meta: {},
        }
      );
    })
    .reduce(mergeReduce, {} as RouterConfig);

  return leaves.reduce((acc, leaf) => {
    if (acc.meta[leaf.parent]) {
      acc.meta[leaf.parent].leaves.push(leaf.child);
    }
    return acc;
  }, output);
};

export { useRouteConfig };
