/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import {
  RouterConfig,
  PageConfig,
  Page,
  PageConfigContext,
} from './useRouteConfig.types';
import { useTranslation } from 'react-i18next';
import mergeWith from 'lodash.mergewith';
import { useConfigFeatureFlag } from 'Hooks';
import { Error404 } from 'Panels';
import get from 'lodash.get';

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
    return Object.values(input)
      .map((page: Page) => {
        const contexts = page.contexts;

        return contexts.reduce(
          (acc, context) => {
            const translatedName = translate(context.name);
            const linkKey = generateKey(
              translatedName,
              'link',
              context.properties
            );
            const routeKey = generateKey(
              translatedName,
              'route',
              context.properties
            );
            const pageEnabled = get(featureFlags.client, context.feature_flag);

            if (pageEnabled) {
              if (isTopLevelNav(context.path)) {
                acc.links.push({
                  to: context.path,
                  key: linkKey,
                  children: translatedName,
                });
              } else {
                const topLevelPath = `/${extractTopLevelPath(context.path)}`;
                const leaf = {
                  path: context.path,
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
                pageType: context.pageType,
                order: context.order,
                properties: context.properties ? context.properties : {},
                isTopLevel: isTopLevelNav(context.path),
                icon: context.icon,
              };

              if (acc.meta[context.path]) {
                acc.meta[context.path] = {
                  ...meta,
                  leaves: acc.meta[context.path].leaves,
                };
              } else {
                acc.meta[context.path] = {
                  ...meta,
                  leaves: [],
                };
              }
            }

            acc.routes.push({
              path: context.path,
              key: routeKey,
              componentForRoute: pageEnabled ? page.contentComponent : Error404,
            });

            return acc;
          },
          {
            links: [],
            routes: [],
            meta: {},
            isComplete,
          } as RouterConfig
        );
      })
      .reduce(mergeReduce, {} as RouterConfig);
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
