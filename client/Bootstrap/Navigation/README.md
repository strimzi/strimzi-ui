# Navigation

This component provides navigation and routing capability to the Strimzi ui. This enables an end user of the Strimzi ui to be able to navigate around the UI in an intuitive manner as well as having unique URLs per page for bookmarking. As a developer of the Strimzi ui, this component should own and encapsulate all navigation logic, rendering pages when requested by a user based on a known configuration structure, and offer any rendered page appropriate state and helper functions that a page may need to operate.

To achieve this, the component accepts [the page configuration](../../Pages/README.md) via the `configuration` property, [which is then processed](#route-configuration-processing), resulting in a [React Router](https://github.com/ReactTraining/react-router) based routing implementation derived from that configuration. React Router will handle URL parsing, and will render a given component when a particular route is accessed by the user.

In addition to this, the Navigation component is also responsible for rendering the visual Navigation components that an end user interacts with, such as the 1st, 2nd or 3rd levels of navigation. It renders these as needed, based on the current page a user is viewing, and the [type of page it defines itself as](#page-types). These page types are declarative to encapsulate the different types of Navigation visual components used, and are defined and exported as a part of this component.

The final responsibility this component is to handle asynchronous loading of pages via React Lazy and Suspense (if required), and to provide the pages with access to helper functions and navigation state, such as path parameters or redirection functions to other pages.

## Properties

The properties expected by this component are as follows:

| Property        | Type                                                                                            | Required | Default value (if no value provided)                                                          |
| --------------- | ----------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------- |
| `configuration` | Object, values of which implement the [page schema](../../Pages/README.md#page-metadata-schema) | No       | The exported content from the `Pages` module (ie all pages from the `Client/Pages` directory) |

Additional properties to follow in a later PR.

## Provided helpers/state to components on render

When a route is accessed, a component (as per the configuration provided via [props](#Properties)) will be rendered by the Navigation component. As a part of this rendering, a number of helper functions, as well as navigation state, will be passed to that rendered component via a `navigationState` property (as well as any other defined properties to pass as [as per that page's configuration](../../Pages/README.md#page-metadata-schema)). This allows the Navigation to own/manage navigation state and functionality, but still allow any rendered components the ability to access or make changes to the navigation they need. The snippet below details the content of the `navigationState` property:

```ts
{
    state: {
        path: {
            ':name': 'myTopic',
            ...
        },
        query: {
            showSlideout: 'true',
            ...
        }
    },
    goBack: () => ...,
    hasRoute: (route) => ...,
    renderLinkTo: (route, [pathParams, [queryParams]]) => ...,
    goTo: (route, [pathParams, [queryParams]]) => ...
}

```

Where:

- `state` contains the current navigation state a component may be interested in, including:
  - `path` are the path parameters in the current URL. The keys are path parameter names, as defined in the route
  - `query` are any query parameters present in the current URL
- `goBack` is a function to go back to the previous page Strimzi-ui page (if the previous page is a Strimzi-ui page - if not returns to `/`)
- `hasRoute` is a function that returns `true`/`false` if the route provided by parameter exists/has been created by the Navigation. This could be called to inform if `renderLinkTo` or `goTo` need to be called (if a route/page does or does not exist). `route` is the string provided in page metadata
- `renderLinkTo` is a function that returns JSX for a clickable link which is rendered in the page which will redirect. The parameters provided will set where the link goes. This is preferred over using a standard anchor element as these (pending attributes) could cause an un-needed full page redirect. `route` is the string provided in page metadata
- `goTo` is a function that will programmatically redirect/update the URL to the provided values (as if the user had clicked a link to change page). `route` is the string provided in page metadata

## Example usage

To follow in a later PR.

## Route configuration processing

As mentioned, this component takes in [configuration](../../Pages/README.md) which maps [`Panels`](../../Panels/README.md) to routes, along with other supporting metadata, such as a translatable page names, what backend services are required to show the page, and what authorization(s) a user may need to see it. This configuration is processed via the Navigation's model, and will result in an object which is then iterated on in the Navigation's view layers to generate the UI's routing/navigation. For example, given the following configuration:

```ts
{
    Homepage: {
        contentComponent: HomePageComponent, // synchronous import - meaning it will be included in the core bundle returned to the user
        contexts: [
            {
                path: '/homepage',
                name: 'HOME_TRANSLATION_KEY', // when translated will map to the string 'Home'
                feature_flag: 'PAGE.HOME',
                order: 0,
                icon: HomeIcon,
                pageType: HOME,
                properties: {},
                requiresMinimum: {
                    backendSupportFor: {},
                    authorizationOf: {}
                }
            }
        ]
    },
    ConsumerGroups: {
        contentComponent: () => import('Panels/ConsumerGroups'), // async import - returned when accessed/needed for the first time
        contexts: [
            {
                path: '/consumergroups',
                name: 'CONSUMER_GROUPS_TRANSLATION_KEY', // when translated will map to the string 'Consumer Groups'
                feature_flag: 'PAGE.CONSUMER_GROUPS',
                order: 2,
                icon: ConsumerGroupIcon,
                pageType: NORMAL,
                properties: {
                    mode: 'Cluster'
                },
                requiresMinimum: {
                    backendSupportFor: {
                        Group: { READ }
                    },
                    authorizationOf: {
                        Group: { READ }
                    }
                }
            },
            {
                path: '/topics/:name/consumergroups',
                name: 'CONSUMER_GROUPS_TRANSLATION_KEY', // when translated will map to the string 'Consumer Groups'
                feature_flag: 'PAGE.TOPIC.CONSUMER_GROUPS',
                order: 0,
                icon: undefined,
                pageType: NORMAL,
                properties: {
                    mode: 'Topic'
                },
                requiresMinimum: {
                    backendSupportFor: {
                        Group: { READ }
                    },
                    authorizationOf: {
                        Group: { READ },
                        Topic: { READ }
                    }
                }
            }
        ]
    }
    Topics: {
        contentComponent: () => import('Panels/Topics'), // async import
        contexts: [
            {
                path: '/topics',
                name: 'TOPICS_TRANSLATION_KEY', // when translated will map to the string 'Topic'
                feature_flag: 'PAGE.TOPICS',
                order: 1,
                icon: TopicIcon,
                pageType: NORMAL,
                properties: {},
                requiresMinimum: {
                    backendSupportFor: {
                        Topic: { READ }
                    },
                    authorizationOf: {
                        Topic: { READ }
                    }
                }
            }
        ]
    },
    TopicsEdit: {
        contentComponent: () => import('Panels/TopicsEdit'), // async import
        contexts: [
            {
                path: '/topics/:name/edit',
                name: 'TOPICS_EDIT_TRANSLATION_KEY', // when translated will map to the string 'Edit topic ${name}' - where name is the value from the path parameter :name
                feature_flag: 'PAGE.TOPICS.EDIT',
                order: 5,
                icon: undefined,
                pageType: FULLSCREEN,
                properties: {},
                requiresMinimum: {
                    backendSupportFor: {
                        Topic: { READ, EDIT }
                    },
                    authorizationOf: {
                        Topic: { READ, EDIT }
                    }
                }
            }
        ]
    }
}
```

This configuration is iterated on in the model hook. This hook makes use of three other hooks to get the current state of backend capability ([defined by the result of GraphQL Schema introspection](../../../docs/Architecture.md#introspection)), a user's [authorization](../../../docs/Architecture.md#security) on backend resources, and [feature flag state/entablement](../../../docs/Architecture.md#configuration-and-feature-flagging). Based on these values, as well as knowledge of special use case pages for error cases etc, the configuration is reduced into a form for the view layer to render. This looks as follows, for the above configuration (assuming all flags are enabled, the user has all required authorization, but the backend cannot support Topic editing).

```ts
{
    Links: [
        {
            to: '/homepage',
            key: 'link-Home',
            children: 'Home'
        },
        {
            to: '/topics',
            key: 'link-Topics',
            children: 'Topics'
        },
        {
            to: '/consumergroups',
            key: 'link-ConsumerGroups.Cluster',
            children: 'Consumer Groups'
        }
    ],
    Routes: [{
        path: '/homepage',
        key: 'route-Home',
        componentForRoute: HomePageComponent
    },
    {
        path: '/topics',
        key: 'route-Topics',
        componentForRoute: () => import('Panels/Topics')
    },
    {
        path: '/consumergroups',
        key: 'route-ConsumerGroups.Cluster',
        componentForRoute: () => import('Panels/ConsumerGroups')
    },
    {
        path: '/topics/:name/consumergroups',
        key: 'route-ConsumerGroups.Topic',
        componentForRoute: () => import('Panels/ConsumerGroups')
    },
    {
        path: '/topics/:name/edit',
        key: 'route-Topics.Edit',
        componentForRoute: 404PageComponent
    },
    ],
    meta: {
        '/homepage': {
            name: 'Home',
            pageType: HOME,
            order: 0,
            properties: {},
            isTopLevel: true,
            icon: HomeIcon,
            leaves: []
        },
        '/topics': {
            name: 'Topics',
            pageType: NORMAL,
            order: 1,
            properties: {},
            isTopLevel: true,
            icon: TopicIcon,
            leaves: [
                {
                    path: '/topics/:name/consumergroups',
                    name: 'Consumer Groups'
                }
            ]
        },
        '/consumergroups': {
            name: 'Consumer Groups',
            pageType: NORMAL,
            order: 2,
            properties: {
                mode: 'Cluster'
            },
            isTopLevel: true,
            icon: ConsumerGroupIcon,
            leaves: []
        },
        '/topics/:name/consumergroups': {
            name: 'Consumer Groups',
            pageType: NORMAL,
            order: 0,
            properties: {
                mode: 'Topic'
            },
            isTopLevel: false,
            icon: undefined,
            leaves: []
        },
        '/topics/:name/edit': {
            name: 'Edit topic ${name}',
            pageType: FULLSCREEN,
            order: 5,
            properties: {
                message: 'The backend cannot support this capability. Contact your administrator.'
            },
            isTopLevel: false,
            icon: undefined,
            leaves: []
        },
    }
}
```

Where:

- `Links` will contain configuration ready to spread on a Link component for all top level pages, determined by path (ie all mount on `/`). React Router offers multiple types of Link depending on requirement, hence the returned content, ready to object spread. Do also note the order of the links. As homepage had order 0, topics 1 and consumer groups 2, they have been returned in that order.
- `Routes` will contain configuration ready to iterate on to create React Router Route components. The reason we don't return components directly here is so the View can provide React Lazy / Suspense / Error Boundary support, so the navigation can render supporting navigation elements alongside the route's content, as well as having access to React Router state (such as path parameters, which are our of scope otherwise).
- `meta` will be an object containing per path reduced state for rendering a given page when that route is active. This object will also contain some derived information, such as `isTopLevel` (is this a top level page) and `leaves` (children of this current page the user can access - eg edit topic in this case is not listed as a leaf as the backend cannot support it. Note that path parameters are NOT considered as page in their own right)

Note in this case that the `Edit topic` page, configuration has been returned differently to the given input to reflect the fact the backend cannot support the required requests. In this instance, the Navigation logic will instead show the user a 404 error page, and even pass a property for that component so the user can be told why the are seeing this page.

## Page Types

The Navigation component defines (and exports) a number of `page types`, which will be referenced

| Page type/constant name | Scenario used in                                                                                                                        | Navigation capabilities rendered                                                                                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HOME`                  | Used for the landing or home page in the UI                                                                                             | Top level navigation items rendered only, to free up as much space as possible for content                                                                                                                             |
| `NORMAL`                | For a 'standard/normal' page in the UI                                                                                                  | Top level pages shown in the UI (for quick/easy access), as well as headline details of what page/content the user currently is looking at, and (based on path) related/peer pages/breadcrumb to/from the current page |
| `FULLSCREEN`            | For a page in the UI, such as a creation flow, where navigation away from the current content should be a deliberate choice by the user | A breadcrumb type control, with a 'back' capability. No other navigation controls are rendered                                                                                                                         |
