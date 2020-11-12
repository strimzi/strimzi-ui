/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { FunctionComponent } from 'react';

type PageProperties = {
  mode: string;
};

type PageConfigContext = {
  path: string;
  name: string;
  feature_flag: string;
  order: number;
  icon: string;
  pageType: string;
  properties?: PageProperties;
  requiresMinimum?: {
    backendSupportFor?: Record<string, unknown>;
    authorizationOf?: Record<string, unknown>;
  };
};

type Link = {
  to: string;
  key: string;
  children: string;
};

type Route = {
  path: string;
  key: string;
  componentForRoute: FunctionComponent | (() => FunctionComponent);
};

type Meta = {
  name: string;
  pageType: string;
  order: number;
  properties: PageProperties;
  isTopLevel: boolean;
  icon: string;
  leaves: Array<{
    path: string;
    name: string;
  }>;
};

/** Type of input to useRouteConfig */
export type PageConfig = Record<string, Page>;

/** Type of a page which is part of a page config */
export type Page = {
  contentComponent: FunctionComponent | (() => FunctionComponent);
  contexts: Array<PageConfigContext>;
};

/** Type of output from useRouteConfig */
export type RouterConfig = {
  links: Array<Link>;
  routes: Array<Route>;
  meta: Map<string, Meta> | Record<string, unknown>;
};

/** Type describing a relationship between a child nav and it's parent nav */
export type Leaf = {
  parent: string;
  child: {
    path: string;
    name: string;
  };
};
