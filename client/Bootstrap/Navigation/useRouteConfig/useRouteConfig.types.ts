/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { FunctionComponent } from 'react';

/** Possible types of pages */
export enum PageType {
  /** Used for the landing or home page */
  HOME,
  /** For a 'standard/normal' page */
  NORMAL,
  /** For a page where navigation should be hidden */
  FULLSCREEN,
}

type PageProperties = {
  mode?: string;
};

type PageConfigContext = {
  /** URL path for a page */
  path: string;
  /** Display name of a page */
  name: string;
  /** Feature flag to show/hide a page */
  feature_flag: string;
  /** Position preference in list of pages (lower number = higher priority) */
  order: number;
  /** Icon to be rendered next to display name */
  icon: string;
  /** Type of page to render  */
  pageType: PageType;
  /** Additional props to pass to a page */
  properties?: PageProperties;
  /** Requirements that need to be satisfied in order for a page to exist */
  requiresMinimum?: {
    /** Requirements that the backend needs to support */
    backendSupportFor?: Record<string, unknown>;
    /** Requirements that a user must have authorization of */
    authorizationOf?: Record<string, unknown>;
  };
};

/** Describing a react router Link */
type Link = {
  /** Path that the link directs to */
  to: string;
  /** Identifying key */
  key: string;
  /** Display name of the link */
  children: string;
};

/** Describing a react router route */
type Route = {
  /** Path that the route resolves */
  path: string;
  /** Identifying key */
  key: string;
  /** Component to be rendered when this route is resovled */
  componentForRoute: FunctionComponent | (() => FunctionComponent);
};

/** Page metadata */
type Meta = {
  /** Display name of a page */
  name: string;
  /** Type of page to render  */
  pageType: PageType;
  /** Position preference in list of pages (lower number = higher priority) */
  order: number;
  /** Additional props to pass to a page */
  properties: PageProperties;
  /** If the page is present in top level navigation */
  isTopLevel: boolean;
  /** Icon to be rendered next to display name */
  icon: string;
  /** Pages that can be navigated to through this page */
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
