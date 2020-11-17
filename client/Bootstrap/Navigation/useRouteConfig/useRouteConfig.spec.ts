/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { useRouteConfig } from 'Bootstrap/Navigation';
import { PageConfig, RouterConfig, PageType } from 'Bootstrap/Navigation/types';
import { generateSimplePage } from './useRouteConfig.assets';

const READ = '';

const HOME = PageType.HOME;
const NORMAL = PageType.NORMAL;
const FULLSCREEN = PageType.FULLSCREEN;

describe('useRouteConfig tests', () => {
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
            pageType: HOME,
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
          key: 'link-Home',
          children: 'Home',
        },
      ],
      routes: [
        {
          path: '/homepage',
          key: 'route-Home',
          componentForRoute: HomePage,
        },
      ],
      meta: {
        '/homepage': {
          name: 'Home',
          pageType: HOME,
          order: 0,
          isTopLevel: true,
          properties: {},
          icon: 'myicon.svg',
          leaves: [],
        },
      },
    };

    const output = useRouteConfig(input);

    expect(output).toEqual(expectedOutput);
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
            pageType: HOME,
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
            pageType: NORMAL,
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
          key: 'route-Home',
          componentForRoute: HomePage,
        },
        {
          path: '/topics',
          key: 'route-Topics',
          componentForRoute: TopicsPage,
        },
      ],
      meta: {
        '/homepage': {
          name: 'Home',
          pageType: HOME,
          order: 0,
          isTopLevel: true,
          properties: {},
          icon: 'myicon.svg',
          leaves: [],
        },
        '/topics': {
          name: 'Topics',
          pageType: NORMAL,
          order: 1,
          properties: {},
          isTopLevel: true,
          icon: 'myicon.svg',
          leaves: [],
        },
      },
    };

    const output = useRouteConfig(input);

    expect(output).toEqual(expectedOutput);
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
            pageType: NORMAL,
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
            pageType: NORMAL,
            properties: {
              mode: 'Cluster',
            },
            requiresMinimum: {},
          },
          {
            path: '/topics/:name/consumergroups',
            name: 'Consumer Groups',
            feature_flag: 'PAGE.TOPIC.CONSUMER_GROUPS',
            order: 0,
            icon: 'myicon.svg',
            pageType: NORMAL,
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
        { to: '/topics', key: 'link-Topics', children: 'Topics' },
        {
          to: '/consumergroups',
          key: 'link-ConsumerGroups.Cluster',
          children: 'Consumer Groups',
        },
      ],
      routes: [
        {
          path: '/topics',
          key: 'route-Topics',
          componentForRoute: TopicsPage,
        },
        {
          path: '/consumergroups',
          key: 'route-ConsumerGroups.Cluster',
          componentForRoute: ConsumerGroupsPage,
        },
        {
          path: '/topics/:name/consumergroups',
          key: 'route-ConsumerGroups.Topic',
          componentForRoute: ConsumerGroupsPage,
        },
      ],
      meta: {},
    };

    const output = useRouteConfig(input);

    expect(output.links).toEqual(expectedOutput.links);
    expect(output.routes).toEqual(expectedOutput.routes);
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
            pageType: NORMAL,
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
            pageType: FULLSCREEN,
          },
        ],
      },
    };

    const expectedOutput: RouterConfig = {
      links: [
        {
          to: '/topics',
          key: 'link-Topics',
          children: 'Topics',
        },
      ],
      routes: [
        {
          path: '/topics',
          key: 'route-Topics',
          componentForRoute: TopicsPage,
        },
        {
          path: '/topics/:name/edit',
          key: 'route-Edittopic',
          componentForRoute: EditTopicsPage,
        },
      ],
      meta: {},
    };

    const output = useRouteConfig(input);

    expect(output.links).toStrictEqual(expectedOutput.links);
    expect(output.routes).toEqual(expectedOutput.routes);
  });

  it('Given nested pages, generate a leaves array correctly', () => {
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
            pageType: NORMAL,
          },
        ],
      },
      ConsumerGroups: {
        contentComponent: ConsumerGroupsPage,
        contexts: [
          {
            path: '/topics/:name/consumergroups',
            name: 'Consumer Groups',
            feature_flag: 'PAGE.TOPIC.CONSUMER_GROUPS',
            order: 0,
            icon: 'myicon.svg',
            pageType: NORMAL,
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
        '/topics': {
          name: 'Topics',
          pageType: NORMAL,
          order: 1,
          isTopLevel: true,
          properties: {},
          icon: 'myicon.svg',
          leaves: [
            {
              path: '/topics/:name/consumergroups',
              name: 'Consumer Groups',
            },
          ],
        },
        '/topics/:name/consumergroups': {
          name: 'Consumer Groups',
          pageType: NORMAL,
          order: 0,
          properties: {
            mode: 'Topic',
          },
          isTopLevel: false,
          icon: 'myicon.svg',
          leaves: [],
        },
      },
    };

    const output = useRouteConfig(input);

    expect(output.meta).toEqual(expectedOutput.meta);
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
            feature_flag: 'PAGE.TOPIC.CONSUMER_GROUPS',
            order: 0,
            icon: 'myicon.svg',
            pageType: NORMAL,
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
          name: 'Consumer Groups',
          pageType: NORMAL,
          order: 0,
          properties: {
            mode: 'Topic',
          },
          isTopLevel: false,
          icon: 'myicon.svg',
          leaves: [],
        },
      },
    };

    const output = useRouteConfig(input);

    expect(output.meta).toEqual(expectedOutput.meta);
  });
});
