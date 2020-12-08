/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { NavigationWrapper } from './Navigation';
import {
  PageComponentProperties,
  RouterConfig,
  PageType,
} from 'Bootstrap/Navigation/types';
import { renderWithRouter } from 'utils/test';
import { act } from '@testing-library/react';
import { generateSimplePage } from './useRouteConfig/useRouteConfig.assets';

const generateTestComponentWithCallback = (
  callback,
  { renderChildren } = {
    // eslint-disable-next-line react/display-name
    renderChildren: (navigationState) => (
      <p>{JSON.stringify(navigationState)}</p>
    ),
  }
) => {
  const TestComponent: FunctionComponent<PageComponentProperties> = ({
    navigationState,
  }) => {
    callback(navigationState);
    return <div>{renderChildren(navigationState)}</div>;
  };
  return TestComponent;
};

describe('Navigation tests', () => {
  it('Creates top level nav correctly', () => {
    const Home = generateSimplePage('Home');

    const navConfig = {
      links: [
        {
          to: '/homepage',
          key: 'link-Home',
          children: 'HomeButton',
        },
        {
          to: '/topics',
          key: 'link-Topics',
          children: 'TopicsButton',
        },
      ],
      routes: [
        {
          path: '/homepage',
          key: 'homekey',
          componentForRoute: Home,
        },
      ],
      meta: {
        '/homepage': {
          pageType: PageType.HOME,
        },
        '/topics': {
          pageType: PageType.HOME,
        },
      },
    };

    const { getByText } = renderWithRouter(
      <NavigationWrapper configuration={navConfig} />,
      { route: '/homepage' }
    );
    expect(getByText('HomeButton')).toBeInTheDocument();
    expect(getByText('TopicsButton')).toBeInTheDocument();
  });

  it('Navigation state contains path parameters', (done) => {
    const expectedOutput = (navigationState) => {
      console.dir(navigationState);
      expect(navigationState.state.path).toEqual({
        name: 'strimzi',
      });
      done();
    };

    const navConfig: RouterConfig = {
      links: [],
      routes: [
        {
          path: '/test/:name',
          key: 'routekey',
          componentForRoute: generateTestComponentWithCallback(expectedOutput),
        },
      ],
      meta: {
        '/test/:name': {
          pageType: PageType.NORMAL,
        },
      },
    };

    renderWithRouter(<NavigationWrapper configuration={navConfig} />, {
      route: '/test/strimzi',
    });
  });

  it('Navigation state contains query parameters', (done) => {
    const expectedOutput = (navigationState) => {
      expect(navigationState.state.query).toEqual({
        name: 'strimzi',
        purpose: 'test',
      });
      done();
    };

    const navConfig: RouterConfig = {
      links: [],
      routes: [
        {
          path: '/test',
          key: 'routekey',
          componentForRoute: generateTestComponentWithCallback(expectedOutput),
        },
      ],
      meta: {
        '/test': {
          pageType: PageType.NORMAL,
        },
      },
    };

    renderWithRouter(<NavigationWrapper configuration={navConfig} />, {
      route: '/test?name=strimzi&purpose=test',
    });
  });

  it('Navigation state contains hasRoute function that returns true if a route exists', (done) => {
    const expectedOutput = (navigationState) => {
      let result = navigationState.hasRoute('/test');
      expect(result).toBe(true);
      result = navigationState.hasRoute('/noroute');
      expect(result).toBe(false);
      done();
    };

    const navConfig: RouterConfig = {
      links: [],
      routes: [
        {
          path: '/test',
          key: 'routekey',
          componentForRoute: generateTestComponentWithCallback(expectedOutput),
        },
      ],
      meta: {
        '/test': {
          pageType: PageType.NORMAL,
        },
      },
    };

    renderWithRouter(<NavigationWrapper configuration={navConfig} />, {
      route: '/test',
    });
  });

  it('Navigation state contains renderLinkTo function that returns a configured link', (done) => {
    const expectedOutput = (navigationState) => {
      const result = navigationState.renderLinkTo(
        '/hello/:name',
        { name: 'strimzi' },
        { purpose: 'strimzi' }
      );
      expect(result).toEqual(<Link to={'/hello/strimzi?purpose=strimzi'} />);
      done();
    };

    const navConfig: RouterConfig = {
      links: [],
      routes: [
        {
          path: '/test',
          key: 'routekey',
          componentForRoute: generateTestComponentWithCallback(expectedOutput),
        },
      ],
      meta: {
        '/test': {
          pageType: PageType.NORMAL,
        },
      },
    };

    renderWithRouter(<NavigationWrapper configuration={navConfig} />, {
      route: '/test',
    });
  });

  it('Navigation state contains goTo function that returns a configured redirect', (done) => {
    const expectedOutput = (navigationState) => {
      const result = navigationState.goTo(
        '/hello/:name',
        { name: 'strimzi' },
        { purpose: 'strimzi' }
      );
      expect(result).toEqual(
        <Redirect to={'/hello/strimzi?purpose=strimzi'} />
      );
      done();
    };

    const navConfig: RouterConfig = {
      links: [],
      routes: [
        {
          path: '/test',
          key: 'routekey',
          componentForRoute: generateTestComponentWithCallback(expectedOutput),
        },
      ],
      meta: {
        '/test': {
          pageType: PageType.NORMAL,
        },
      },
    };

    renderWithRouter(<NavigationWrapper configuration={navConfig} />, {
      route: '/test',
    });
  });

  it('Query parameters are retained between clicking links', (done) => {
    const Home = generateSimplePage('Home');

    const expectedOutput = (navigationState) => {
      expect(navigationState.state.query).toEqual({
        test: 'strimzi',
      });
      done();
    };

    const navConfig: RouterConfig = {
      links: [
        {
          to: '/homepage',
          key: 'link-Home',
          children: 'Home',
        },
        {
          to: '/topics',
          key: 'link-Topics',
          children: 'Topics',
        },
      ],
      routes: [
        {
          path: '/homepage',
          key: 'homekey',
          componentForRoute: Home,
        },
        {
          path: '/topics',
          key: 'routekey',
          componentForRoute: generateTestComponentWithCallback(expectedOutput),
        },
      ],
      meta: {
        '/homepage': {
          pageType: PageType.HOME,
        },
        '/topics': {
          pageType: PageType.NORMAL,
        },
      },
    };

    const { getByText } = renderWithRouter(
      <NavigationWrapper configuration={navConfig} />,
      {
        route: '/homepage?test=strimzi',
      }
    );

    act(() => {
      getByText('Topics').click();
    });
  });

  it('goBack sends the user to the nearest parent', () => {
    const navConfig: RouterConfig = {
      links: [],
      routes: [
        {
          path: '/topics/:name/consumergroups',
          key: 'consumergroupkey',
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          componentForRoute: generateTestComponentWithCallback(() => {}, {
            renderChildren: (navigationState) => navigationState.goBack(),
          }),
        },
      ],
      meta: {
        '/topics/:name/consumergroups': {
          pageType: PageType.NORMAL,
        },
        '/topics': {
          pageType: PageType.NORMAL,
        },
      },
    };

    act(() => {
      renderWithRouter(<NavigationWrapper configuration={navConfig} />, {
        route: '/topics/strimzi/consumergroups',
      });
    });

    expect(window.location.pathname).toBe('/topics');
  });

  it('Shows 404 page when there is no route for a path', () => {
    const navConfig: RouterConfig = {
      links: [],
      routes: [],
      meta: {},
    };

    const { getByText } = renderWithRouter(
      <NavigationWrapper configuration={navConfig} />,
      {
        route: '/nopage',
      }
    );

    expect(getByText('Error 404')).toBeInTheDocument();
  });

  it('Generates a second level nav when needed', () => {
    const NestedPage = generateSimplePage('Nested');

    const navConfig: RouterConfig = {
      links: [],
      routes: [
        {
          path: '/this/is/nested1',
          key: 'nestedkey',
          componentForRoute: NestedPage,
        },
      ],
      meta: {
        '/this/is/nested1': {
          pageType: PageType.NORMAL,
        },
        '/this': {
          leaves: [
            {
              to: '/this/is/nested1',
              key: 'nested1',
              children: 'Nested1',
            },
            {
              to: '/this/is/nested2',
              key: 'nested2',
              children: 'Nested2',
            },
          ],
        },
      },
    };

    const { getByText } = renderWithRouter(
      <NavigationWrapper configuration={navConfig} />,
      {
        route: '/this/is/nested1',
      }
    );

    expect(getByText('Nested1')).toBeInTheDocument();
    expect(getByText('Nested2')).toBeInTheDocument();
  });

  it('Hides top level nav when a page is defined as fullscreen', () => {
    const Home = generateSimplePage('Home');

    const navConfig = {
      links: [
        {
          to: '/homepage',
          key: 'link-Home',
          children: 'HomeButton',
        },
      ],
      routes: [
        {
          path: '/homepage',
          key: 'homekey',
          componentForRoute: Home,
        },
      ],
      meta: {
        '/homepage': {
          pageType: PageType.FULLSCREEN,
        },
      },
    };

    const { queryByText } = renderWithRouter(
      <NavigationWrapper configuration={navConfig} />,
      { route: '/homepage' }
    );
    expect(queryByText('HomeButton')).not.toBeInTheDocument();
  });
});
