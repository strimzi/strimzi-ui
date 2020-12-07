/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import {
  RouterConfig,
  PageConfig,
  PageConfigContext,
  FlatPageConfig,
} from './useRouteConfig.types';
import { useTranslation } from 'react-i18next';
import { useConfigFeatureFlag } from 'Hooks';
import { Error404 } from 'Panels';
import get from 'lodash.get';
import { TFunction } from 'i18next';
import { ConfigFeatureFlagType } from 'Contexts/types';

const isTopLevelNav = (path: string) => path.split('/').length === 2;

const extractTopLevelPath = (path: string) => path.split('/')[1];

const generateKey = (
  name: string,
  prefix: string,
  properties: PageConfigContext['properties']
) =>
  `${prefix}-${removeWhitespace(removePathVars(name))}${
    properties && properties.mode ? `.${properties.mode}` : ''
  }`;

const removeWhitespace = (name: string) => name.replace(/\s/g, '');

const removePathVars = (name: string) => name.replace(/\${[^}]*\}/g, '');

const flattenPageConfig = (pageConfig: PageConfig): FlatPageConfig => {
  return Object.values(pageConfig).reduce((acc, page) => {
    const flatPage = page.contexts.reduce((acc, context) => {
      return [...acc, { contentComponent: page.contentComponent, ...context }];
    }, [] as FlatPageConfig);

    return [...acc, ...flatPage];
  }, [] as FlatPageConfig);
};

const pruneParents = (routerConfig: RouterConfig): RouterConfig => {
  const meta = routerConfig.meta;
  const cleanMeta = {};
  for (const key in meta) {
    if (meta[key].name !== undefined) cleanMeta[key] = meta[key];
  }
  routerConfig.meta = cleanMeta;
  return routerConfig;
};

const reduceToRouterConfig = (
  flatPageConfig: FlatPageConfig,
  translate: TFunction,
  featureFlags: ConfigFeatureFlagType['featureFlags']
): RouterConfig => {
  return flatPageConfig.reduce(
    (acc, page) => {
      const translatedName = translate(page.name);
      const linkKey = generateKey(translatedName, 'link', page.properties);
      const routeKey = generateKey(translatedName, 'route', page.properties);
      const pageEnabled = get(featureFlags.client, page.feature_flag);

      if (pageEnabled) {
        if (isTopLevelNav(page.path)) {
          acc.links.push({
            to: page.path,
            key: linkKey,
            children: translatedName,
          });
        } else {
          const topLevelPath = `/${extractTopLevelPath(page.path)}`;
          const leaf = {
            path: page.path,
            name: translatedName,
          };
          if (acc.meta[topLevelPath]) {
            acc.meta[topLevelPath].leaves.push(leaf);
          } else {
            acc.meta[topLevelPath] = {
              leaves: [leaf],
            };
          }
        }

        const meta = {
          name: translatedName,
          pageType: page.pageType,
          order: page.order,
          properties: page.properties ? page.properties : {},
          isTopLevel: isTopLevelNav(page.path),
          icon: page.icon,
        };

        if (acc.meta[page.path]) {
          acc.meta[page.path] = {
            ...meta,
            leaves: acc.meta[page.path].leaves,
          };
        } else {
          acc.meta[page.path] = {
            ...meta,
            leaves: [],
          };
        }
      }

      acc.routes.push({
        path: page.path,
        key: routeKey,
        componentForRoute: pageEnabled ? page.contentComponent : Error404,
      });

      return acc;
    },
    {
      links: [],
      routes: [],
      meta: {},
      isComplete: true,
    } as RouterConfig
  );
};

const useRouteConfig = (pageConfig: PageConfig): RouterConfig => {
  const { t: translate } = useTranslation();
  const { featureFlags, isComplete } = useConfigFeatureFlag();

  if (isComplete) {
    const flatPageConfig = flattenPageConfig(pageConfig);
    const reducedConfig = reduceToRouterConfig(
      flatPageConfig,
      translate,
      featureFlags
    );
    return pruneParents(reducedConfig);
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
