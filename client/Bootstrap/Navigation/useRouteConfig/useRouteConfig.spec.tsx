/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { useRouteConfig } from './useRouteConfig.hook';
import { renderHook } from '@testing-library/react-hooks';
import { PageConfig, RouterConfig, PageType } from './useRouteConfig.types';
import { generateSimplePage } from './useRouteConfig.assets';
import { translate } from 'utils/test';
import { useConfigFeatureFlag } from 'Hooks';
import { Error404 } from 'Panels';

const READ = '';

const DEFAULT_CONFIG_MOCK = {
  client: {},
  featureFlags: {},
  bootstrapConfig: {},
  loading: false,
  error: false,
  isComplete: true,
  rawResponse: {},
  triggerRefetch: () => {
    console.log('refetch');
  },
};

jest.mock('Hooks');
const mockUseConfigFeatureFlag = useConfigFeatureFlag as jest.MockedFunction<
  typeof useConfigFeatureFlag
>;

describe('useRouteConfig tests - feature flags enabled', () => {
  beforeAll(() => {
    mockUseConfigFeatureFlag.mockReset();
    mockUseConfigFeatureFlag.mockImplementation(() => {
      return {
        ...DEFAULT_CONFIG_MOCK,
        featureFlags: {
          client: {
            PAGE: {
              HOME: true,
              TOPICS: {
                EDIT: true,
                CONSUMER_GROUPS: true,
              },
              CONSUMER_GROUPS: true,
            },
          },
        },
      };
    });
  });

  it('Given a single page config, transform into correct router data', () => {
    const HomePage = generateSimplePage('Home');

    const input: PageConfig = {
      Homepage: {
        contentComponent: HomePage,
        contexts: [
          {
            path: '/homepage',
            name: 'Home',
            feature_flag: 'PAGE.HOME',
            order: 0,
            icon: 'myicon.svg',
            pageType: PageType.HOME,
            requiresMinimum: {
              backendSupportFor: {},
              authorizationOf: {},
            },
          },
        ],
      },
    };

    const expectedOutput: RouterConfig = {
      links: [
        {
          to: '/homepage',
          key: `link-${translate('Home')}`,
          children: translate('Home'),
        },
      ],
      routes: [
        {
          path: '/homepage',
          key: `route-${translate('Home')}`,
          componentForRoute: HomePage,
        },
      ],
      meta: {
        '/homepage': {
          name: translate('Home'),
          pageType: PageType.HOME,
          order: 0,
          isTopLevel: true,
          properties: {},
          icon: 'myicon.svg',
          leaves: [],
        },
      },
      isComplete: true,
    };

    const { result } = renderHook(() => useRouteConfig(input));

    expect(result.current).toEqual(expectedOutput);
  });

  it('Given a multi page config, transform into correct router data', () => {
    const HomePage = generateSimplePage('Home');
    const TopicsPage = generateSimplePage('Topics');

    const input: PageConfig = {
      Homepage: {
        contentComponent: HomePage,
        contexts: [
          {
            path: '/homepage',
            name: 'Home',
            feature_flag: 'PAGE.HOME',
            order: 0,
            icon: 'myicon.svg',
            pageType: PageType.HOME,
            requiresMinimum: {
              backendSupportFor: {},
              authorizationOf: {},
            },
          },
        ],
      },
      Topics: {
        contentComponent: TopicsPage,
        contexts: [
          {
            path: '/topics',
            name: 'Topics',
            feature_flag: 'PAGE.TOPICS',
            order: 1,
            icon: 'myicon.svg',
            pageType: PageType.NORMAL,
            requiresMinimum: {
              backendSupportFor: {
                Topic: { READ },
              },
              authorizationOf: {
                Topic: { READ },
              },
            },
          },
        ],
      },
    };

    const expectedOutput: RouterConfig = {
      links: [
        {
          to: '/homepage',
          key: `link-${translate('Home')}`,
          children: translate('Home'),
        },
        {
          to: '/topics',
          key: `link-${translate('Topics')}`,
          children: translate('Topics'),
        },
      ],
      routes: [
        {
          path: '/homepage',
          key: `route-${translate('Home')}`,
          componentForRoute: HomePage,
        },
        {
          path: '/topics',
          key: `route-${translate('Topics')}`,
          componentForRoute: TopicsPage,
        },
      ],
      meta: {
        '/homepage': {
          name: translate('Home'),
          pageType: PageType.HOME,
          order: 0,
          isTopLevel: true,
          properties: {},
          icon: 'myicon.svg',
          leaves: [],
        },
        '/topics': {
          name: translate('Topics'),
          pageType: PageType.NORMAL,
          order: 1,
          properties: {},
          isTopLevel: true,
          icon: 'myicon.svg',
          leaves: [],
        },
      },
      isComplete: true,
    };

    const { result } = renderHook(() => useRouteConfig(input));

    expect(result.current).toEqual(expectedOutput);
  });

  it('Given a nested, multi-instance page config, only include top level links but full routes', () => {
    const TopicsPage = generateSimplePage('Topics');
    const ConsumerGroupsPage = generateSimplePage('Consumer Groups');

    const input: PageConfig = {
      Topics: {
        contentComponent: TopicsPage,
        contexts: [
          {
            path: '/topics',
            name: 'Topics',
            feature_flag: 'PAGE.TOPICS',
            order: 1,
            icon: 'myicon.svg',
            pageType: PageType.NORMAL,
          },
        ],
      },
      ConsumerGroups: {
        contentComponent: ConsumerGroupsPage,
        contexts: [
          {
            path: '/consumergroups',
            name: 'Consumer Groups',
            feature_flag: 'PAGE.CONSUMER_GROUPS',
            order: 2,
            icon: 'myicon.svg',
            pageType: PageType.NORMAL,
            properties: {
              mode: 'Cluster',
            },
            requiresMinimum: {},
          },
          {
            path: '/topics/:name/consumergroups',
            name: 'Consumer Groups',
            feature_flag: 'PAGE.TOPICS.CONSUMER_GROUPS',
            order: 0,
            icon: 'myicon.svg',
            pageType: PageType.NORMAL,
            properties: {
              mode: 'Topic',
            },
            requiresMinimum: {},
          },
        ],
      },
    };

    const expectedOutput: RouterConfig = {
      links: [
        {
          to: '/topics',
          key: `link-${translate('Topics')}`,
          children: translate('Topics'),
        },
        {
          to: '/consumergroups',
          key: `link-${translate('ConsumerGroups')}.Cluster`,
          children: translate('Consumer Groups'),
        },
      ],
      routes: [
        {
          path: '/topics',
          key: `route-${translate('Topics')}`,
          componentForRoute: TopicsPage,
        },
        {
          path: '/consumergroups',
          key: `route-${translate('ConsumerGroups')}.Cluster`,
          componentForRoute: ConsumerGroupsPage,
        },
        {
          path: '/topics/:name/consumergroups',
          key: `route-${translate('ConsumerGroups')}.Topic`,
          componentForRoute: ConsumerGroupsPage,
        },
      ],
      meta: {},
      isComplete: true,
    };

    const { result } = renderHook(() => useRouteConfig(input));

    expect(result.current.links).toEqual(expectedOutput.links);
    expect(result.current.routes).toEqual(expectedOutput.routes);
  });

  it("Given a top level nested path, don't create a link but keep a route", () => {
    const TopicsPage = generateSimplePage('Topics');
    const EditTopicsPage = generateSimplePage('Edit Topics');

    const input: PageConfig = {
      Topics: {
        contentComponent: TopicsPage,
        contexts: [
          {
            path: '/topics',
            name: 'Topics',
            feature_flag: 'PAGE.TOPICS',
            order: 1,
            icon: 'myicon.svg',
            pageType: PageType.NORMAL,
          },
        ],
      },
      TopicsEdit: {
        contentComponent: EditTopicsPage,
        contexts: [
          {
            path: '/topics/:name/edit',
            name: 'Edit topic ${name}',
            feature_flag: 'PAGE.TOPICS.EDIT',
            order: 5,
            icon: 'myicon.svg',
            pageType: PageType.FULLSCREEN,
          },
        ],
      },
    };

    const expectedOutput: RouterConfig = {
      links: [
        {
          to: '/topics',
          key: `link-${translate('Topics')}`,
          children: translate('Topics'),
        },
      ],
      routes: [
        {
          path: '/topics',
          key: `route-${translate('Topics')}`,
          componentForRoute: TopicsPage,
        },
        {
          path: '/topics/:name/edit',
          key: `route-${translate('Edittopic')}`,
          componentForRoute: EditTopicsPage,
        },
      ],
      meta: {},
      isComplete: true,
    };

    const { result } = renderHook(() => useRouteConfig(input));

    expect(result.current.links).toEqual(expectedOutput.links);
    expect(result.current.routes).toEqual(expectedOutput.routes);
  });

  it('Given nested pages, generate a leaves array correctly', () => {
    const TopicsPage = generateSimplePage('Topics');
    const ConsumerGroupsPage = generateSimplePage('Consumer Groups');

    const input: PageConfig = {
      ConsumerGroups: {
        contentComponent: ConsumerGroupsPage,
        contexts: [
          {
            path: '/topics/:name/consumergroups',
            name: 'Consumer Groups',
            feature_flag: 'PAGE.TOPICS.CONSUMER_GROUPS',
            order: 0,
            icon: 'myicon.svg',
            pageType: PageType.NORMAL,
            properties: {
              mode: 'Topic',
            },
          },
        ],
      },
      Topics: {
        contentComponent: TopicsPage,
        contexts: [
          {
            path: '/topics',
            name: 'Topics',
            feature_flag: 'PAGE.TOPICS',
            order: 1,
            icon: 'myicon.svg',
            pageType: PageType.NORMAL,
          },
        ],
      },
    };

    const expectedOutput: RouterConfig = {
      links: [],
      routes: [],
      meta: {
        '/topics': {
          name: translate('Topics'),
          pageType: PageType.NORMAL,
          order: 1,
          isTopLevel: true,
          properties: {},
          icon: 'myicon.svg',
          leaves: [
            {
              path: '/topics/:name/consumergroups',
              name: translate('Consumer Groups'),
            },
          ],
        },
        '/topics/:name/consumergroups': {
          name: translate('Consumer Groups'),
          pageType: PageType.NORMAL,
          order: 0,
          properties: {
            mode: 'Topic',
          },
          isTopLevel: false,
          icon: 'myicon.svg',
          leaves: [],
        },
      },
      isComplete: true,
    };

    const { result } = renderHook(() => useRouteConfig(input));

    expect(result.current.meta).toEqual(expectedOutput.meta);
  });

  it("if a nested route has a parent that doesn't exists, don't create leafs for the parent", () => {
    const ConsumerGroupsPage = generateSimplePage('Consumer Groups');

    const input: PageConfig = {
      ConsumerGroups: {
        contentComponent: ConsumerGroupsPage,
        contexts: [
          {
            path: '/topics/:name/consumergroups',
            name: 'Consumer Groups',
            feature_flag: 'PAGE.TOPICS.CONSUMER_GROUPS',
            order: 0,
            icon: 'myicon.svg',
            pageType: PageType.NORMAL,
            properties: {
              mode: 'Topic',
            },
          },
        ],
      },
    };

    const expectedOutput: RouterConfig = {
      links: [],
      routes: [],
      meta: {
        '/topics/:name/consumergroups': {
          name: translate('Consumer Groups'),
          pageType: PageType.NORMAL,
          order: 0,
          properties: {
            mode: 'Topic',
          },
          isTopLevel: false,
          icon: 'myicon.svg',
          leaves: [],
        },
      },
      isComplete: true,
    };

    const { result } = renderHook(() => useRouteConfig(input));

    expect(result.current.meta).toEqual(expectedOutput.meta);
  });

  describe('useRouteConfig tests - feature flags disabled', () => {
    beforeEach(() => {
      mockUseConfigFeatureFlag.mockReset();
    });

    it("Given a top level page that can't be viewed, don't create a link or meta but create a route with a 404 panel", () => {
      const HomePage = generateSimplePage('Home');

      mockUseConfigFeatureFlag.mockImplementation(() => {
        return {
          ...DEFAULT_CONFIG_MOCK,
          featureFlags: {
            client: {
              PAGE: {
                HOME: false,
                TOPICS: false,
                CONSUMER_GROUPS: false,
              },
            },
          },
        };
      });

      const input: PageConfig = {
        Homepage: {
          contentComponent: HomePage,
          contexts: [
            {
              path: '/homepage',
              name: 'Home',
              feature_flag: 'PAGE.HOME',
              order: 0,
              icon: 'myicon.svg',
              pageType: PageType.HOME,
              requiresMinimum: {
                backendSupportFor: {},
                authorizationOf: {},
              },
            },
          ],
        },
      };

      const expectedOutput: RouterConfig = {
        links: [],
        routes: [
          {
            path: '/homepage',
            key: `route-${translate('Home')}`,
            componentForRoute: Error404,
          },
        ],
        meta: {},
        isComplete: true,
      };

      const { result } = renderHook(() => useRouteConfig(input));

      expect(result.current).toEqual(expectedOutput);
    });

    it('Returns an empty set of data when feature flag fetch is incomplete', () => {
      mockUseConfigFeatureFlag.mockImplementation(() => {
        return {
          ...DEFAULT_CONFIG_MOCK,
          isComplete: false,
        };
      });

      const expectedOutput = {
        links: [],
        routes: [],
        meta: {},
        isComplete: false,
      };

      const { result } = renderHook(() => useRouteConfig({}));

      expect(result.current).toEqual(expectedOutput);
    });
  });
});
