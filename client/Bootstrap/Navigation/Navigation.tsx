/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import { Link, Route, Switch, useParams, Redirect } from 'react-router-dom';
import { Location } from 'history';
import {
  RouterConfig,
  NavigationProps,
  NavigationState,
  PageType,
  NavLink,
} from 'Bootstrap/Navigation/types';
import { Navigation } from './Navigation.view.carbon';

/**
 * Given an array of link objects, create array of react router link components
 *
 * @param links array of link objects from a router config
 *
 * @returns array of react router link components
 */
const createRouterLinks = (
  links: RouterConfig['links'],
  location: Location
): JSX.Element[] => {
  const query = new URLSearchParams(location.search).toString();

  return links.reduce(
    (acc, link) => [
      ...acc,
      <Link to={query ? `${link.to}?${query}` : link.to} key={link.key}>
        {link.children}
      </Link>,
    ],
    [] as JSX.Element[]
  );
};

/**
 * Given a key, value object, converts into query parameter string that can be used in a URL
 *
 * @param queryParams - Key value parameters
 *
 * @returns string representation of query parameters
 */
const createQueryString = (queryParams: Record<string, string>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(queryParams).map(([key, value]) => {
    searchParams.append(key, value);
  });
  return `?${searchParams.toString()}`;
};

/**
 * Substitutes path parameters into a path with parameterised values
 *
 * @param path string of url path
 * @param pathParams object representation of path parameters
 *
 * @returns string of substituted path
 */
const createPathFromParams = (
  path: string,
  pathParams: Record<string, string>
): string =>
  Object.entries(pathParams).reduce((acc, [key, value]) => {
    return acc.replace(`:${key}`, value);
  }, path);

/**
 * Given a location, parse query parameters into a map
 *
 * @param location result from useLocation() hook
 *
 * @returns map of query params
 */
const getQueryParams = (location): Record<string, string> => {
  const params = Array.from(new URLSearchParams(location.search).entries());
  return params.reduce((acc, entry) => {
    acc[entry[0]] = entry[1];
    return acc;
  }, {});
};

/**
 * Checks if a route exists with the provided path
 *
 * @param routes routes object from router config
 * @param path path of a route to find
 *
 * @returns true if route exists with given path, false otherwise
 */
const hasRouteCurry = (routes: RouterConfig['routes'], path: string) =>
  routes.filter((route) => {
    return route.path === path;
  }).length > 0;

/**
 * Given a route and its parameters, render a link
 *
 * @param route route object to link to
 * @param pathParams path parameters map to sub into the route path
 * @param queryParams query parameters map to add to the end of the path
 *
 * @returns React router
 */
const renderLinkTo = (path: string, pathParams, queryParams) => (
  <Link
    to={createPathFromParams(path, pathParams) + createQueryString(queryParams)}
  />
);

const goBackCurry = (path, routerConfig, pathParams, queryParams) => () => {
  const parent = getNearestParent(path, routerConfig.meta);
  return goTo(parent, pathParams, queryParams);
};

/**
 * Given a route and its parameters, render a redirect
 *
 * @param route route object to redirect to
 * @param pathParams path parameters map to sub into the route path
 * @param queryParams query parameters map to add to the end of the path
 */
const goTo = (
  path: string,
  pathParams: Record<string, string>,
  queryParams: Record<string, string>
) => (
  <Redirect
    to={createPathFromParams(path, pathParams) + createQueryString(queryParams)}
  />
);

const renderRouteComponent = (route, nav: NavigationState) => {
  return <route.componentForRoute navigationState={nav} />;
};

/**
 * Find the closest parent for a given path
 *
 * @param path path to find nearest parent of
 * @param meta all router config meta
 * @example input '/topics/:name/consumergroups' will return '/topics' as that is the closest parent if '/topics/:name' does not exist and '/topics' does.
 */
const getNearestParent = (path: string, meta: RouterConfig['meta']): string => {
  const parent = path.match(/.*\//g);
  if (parent) {
    const parentString = parent[0].substring(0, parent[0].length - 1); // trim '/' at the end of the path
    if (meta[parentString]) {
      return parentString;
    } else {
      return getNearestParent(parentString, meta);
    }
  } else {
    return '';
  }
};

/**
 * Given a path, find the nearest parent and return it's leaves
 *
 * @param path path to find siblings of
 * @param meta meta object to find parent/siblings in
 */
const getSiblings = (
  path: string,
  meta: RouterConfig['meta']
): Array<NavLink> => {
  const parentMeta = meta[getNearestParent(path, meta)];

  if (parentMeta && parentMeta.leaves) {
    return parentMeta.leaves;
  } else {
    return [];
  }
};

/**
 * Returns true if the top level navigation should be rendered on this path
 *
 * @param path path to verify
 * @param routerConfig
 */
const topLevelNavigation = (
  path: string,
  routerConfig: RouterConfig,
  location
) => {
  const shouldRender = routerConfig.meta[path].pageType !== PageType.FULLSCREEN;
  const links = createRouterLinks(routerConfig.links, location);
  return {
    shouldRender,
    links,
  };
};

const childNavigation = (
  path: string,
  routerConfig: RouterConfig,
  location: Location
) => {
  const siblings = getSiblings(path, routerConfig.meta);
  const shouldRender = siblings.length > 0;
  const links = createRouterLinks(siblings, location);
  return {
    shouldRender,
    links,
  };
};

const renderRouterSwitch = (configuration: RouterConfig) => {
  const routeElements = configuration.routes.reduce(
    (acc, route) => [
      ...acc,
      <Route
        exact
        path={route.path}
        key={route.key}
        component={({ location }) => {
          const path = useParams();
          const query = getQueryParams(location);

          const navigationState: NavigationState = {
            state: {
              path,
              query,
            },
            goBack: goBackCurry(route.path, configuration, path, query),
            hasRoute: (path) => hasRouteCurry(configuration.routes, path),
            renderLinkTo,
            goTo,
          };
          const topNav = topLevelNavigation(
            route.path,
            configuration,
            location
          );
          const secondLevelNav = childNavigation(
            route.path,
            configuration,
            location
          );
          return (
            <Navigation
              showTopLevelNav={topNav.shouldRender}
              topLevelLinks={topNav.links}
              showSecondLevelNav={secondLevelNav.shouldRender}
              secondLevelLinks={secondLevelNav.links}
            >
              {renderRouteComponent(route, navigationState)}
            </Navigation>
          );
        }}
      ></Route>,
    ],
    [] as JSX.Element[]
  );

  return (
    <Switch>
      {routeElements}
      <Redirect exact from='/index.html' to='/' />
      <Route component={() => <div>Error 404</div>} />
    </Switch>
  );
};

const NavigationWrapper: FunctionComponent<NavigationProps> = ({
  configuration,
}: NavigationProps) => {
  return renderRouterSwitch(configuration);
};

export { NavigationWrapper };
