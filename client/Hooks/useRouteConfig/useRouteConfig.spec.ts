/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { useRouteConfig } from 'Hooks';
import { PageConfig, RouterConfig } from 'Hooks/types';
import HomePageComponent from '../../../test_common/resources/Home.view';
import TopicsPageComponent from '../../../test_common/resources/Topics.view';
import TopicsEditComponent from '../../../test_common/resources/TopicsEdit.view';
import ConsumerGroupsPageComponent from '../../../test_common/resources/ConsumerGroups.view';

const READ = '';

const HOME = 'home';
const NORMAL = 'normal';
const FULLSCREEN = 'fullscreen';

describe('useRouteConfig tests', () => {
  it('Given a single page config, transform into correct router data', () => {
    const input: PageConfig = {
      Homepage: {
        contentComponent: HomePageComponent,
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
          componentForRoute: HomePageComponent,
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
    const input: PageConfig = {
      Homepage: {
        contentComponent: HomePageComponent,
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
        contentComponent: TopicsPageComponent,
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
          componentForRoute: HomePageComponent,
        },
        {
          path: '/topics',
          key: 'route-Topics',
          componentForRoute: TopicsPageComponent,
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
    const input: PageConfig = {
      Topics: {
        contentComponent: TopicsPageComponent,
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
        contentComponent: ConsumerGroupsPageComponent,
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
          componentForRoute: TopicsPageComponent,
        },
        {
          path: '/consumergroups',
          key: 'route-ConsumerGroups.Cluster',
          componentForRoute: ConsumerGroupsPageComponent,
        },
        {
          path: '/topics/:name/consumergroups',
          key: 'route-ConsumerGroups.Topic',
          componentForRoute: ConsumerGroupsPageComponent,
        },
      ],
      meta: {},
    };

    const output = useRouteConfig(input);

    expect(output.links).toEqual(expectedOutput.links);
    expect(output.routes).toEqual(expectedOutput.routes);
  });

  it("Given a top level nested path, don't create a link but keep a route", () => {
    const input: PageConfig = {
      Topics: {
        contentComponent: TopicsPageComponent,
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
        contentComponent: TopicsEditComponent,
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
          componentForRoute: TopicsPageComponent,
        },
        {
          path: '/topics/:name/edit',
          key: 'route-Topics.Edit',
          componentForRoute: TopicsEditComponent,
        },
      ],
      meta: {},
    };

    const output = useRouteConfig(input);

    expect(output.links).toStrictEqual(expectedOutput.links);
    expect(output.routes).toEqual(expectedOutput.routes);
  });

  it('Given nested pages, generate a leaves array correctly', () => {
    const input: PageConfig = {
      Topics: {
        contentComponent: TopicsPageComponent,
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
        contentComponent: ConsumerGroupsPageComponent,
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
});
