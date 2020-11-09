/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { FunctionComponent } from 'react';

export type PageProperties = {
  mode: string;
};

export type Context = {
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

export type PageConfig = Record<string, Page>;

export type Page = {
  contentComponent: FunctionComponent | (() => FunctionComponent);
  contexts: Array<Context>;
};

export type Link = {
  to: string;
  key: string;
  children: string;
};

export type Route = {
  path: string;
  key: string;
  componentForRoute: FunctionComponent | (() => FunctionComponent);
};

export type Meta = {
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

export type RouterConfig = {
  links: Array<Link>;
  routes: Array<Route>;
  meta: Map<string, Meta> | Record<string, unknown>;
};

export type Leaf = {
  parent: string;
  child: {
    path: string;
    name: string;
  };
};
