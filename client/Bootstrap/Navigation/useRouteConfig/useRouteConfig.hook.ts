/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { RouterConfig, PageConfig, Page, Leaf } from './useRouteConfig.types';
import { useTranslation } from 'react-i18next';
import mergeWith from 'lodash.mergewith';
import { useConfigFeatureFlag } from 'Hooks';
import { Error404 } from 'Panels';
import get from 'lodash.get';

const isTopLevelNav = (path) => path.split('/').length === 2;

const extractTopLevelPath = (path) => path.split('/')[1];

const generateKey = (name, prefix, properties) =>
  `${prefix}-${removeWhitespace(removePathVars(name))}${
    properties && properties.mode ? `.${properties.mode}` : ''
  }`;

const removeWhitespace = (name) => name.replace(/\s/g, '');

const removePathVars = (name) => name.replace(/\${[^}]*\}/g, '');

const checkFeatureFlag = (page, context, featureFlags) => {
  if (get(featureFlags.client, context.feature_flag)) {
    return page.contentComponent;
  } else {
    return Error404;
  }
};

const contextReducer = (
  acc,
  context,
  page,
  leaves,
  featureFlags,
  translate
) => {
  const translatedName = translate(context.name);
  const linkKey = generateKey(translatedName, 'link', context.properties);
  const routeKey = generateKey(translatedName, 'route', context.properties);
  const component = checkFeatureFlag(page, context, featureFlags);

  if (component === page.contentComponent) {
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

    acc.meta[context.path] = {
      name: translatedName,
      pageType: context.pageType,
      order: context.order,
      properties: context.properties ? context.properties : {},
      isTopLevel: isTopLevelNav(context.path),
      icon: context.icon,
      leaves: [],
    };
  }

  acc.routes.push({
    path: context.path,
    key: routeKey,
    componentForRoute: component,
  });

  return acc;
};

const mergeReduce = (acc, cur) =>
  mergeWith(acc, cur, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  });

const useRouteConfig = (input: PageConfig): RouterConfig => {
  const { t: translate } = useTranslation();
  const { featureFlags, isComplete } = useConfigFeatureFlag();

  if (isComplete) {
    const leaves: Array<Leaf> = [];
    const output = Object.values(input)
      .map((value) => {
        const page = value as Page;
        const contexts = page.contexts;

        return contexts.reduce(
          (acc, context) =>
            contextReducer(acc, context, page, leaves, featureFlags, translate),
          {
            links: [],
            routes: [],
            meta: {},
            isComplete,
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
  } else {
    return {
      links: [],
      routes: [],
      meta: {},
      isComplete: false,
    };
  }
};

export { useRouteConfig };
