# Pages

This module defines and exports metadata which describes the pages in the Strimzi UI, and how they relate to the [`Panel`](../Panels/README.md) components that implement them. This metadata is then processed by the UI's [navigation logic](../Bootstrap/Navigation) at runtime to determine what pages are shown and available to a user, but also how they are rendered in context to the wider UI and relate to one another. The motivation for this is three fold: to separate the components that implement a page and navigation (to avoid cross contamination), to enable extensibility for new pages in future, and allow re use of the same `Panel` components in numerous contexts with minimal changes.

## Page Metadata Schema

The schema used to define pages in the Strimzi-ui is designed around capability, and the scenarios those capabilities are presented in. The exported object should be named to reflect the capability it provides, and the metadata contained to specify the `Panel` component used to provide it (`contentComponent`), and where (and how) it should be presented (`contexts`). The below example (pseudo) shape shows the structure expected:

```
export const Topic { // for purposes of example, a Topic page/capability
    contentComponent: () => import('Panel/Topic') // reference to the panel being used for this capability - this is an aysnc example
    contexts: [ // all the contexts or scenarios that panel component is used in
        {
            path: '/topics/edit',
            name: 'TOPICS_EDIT_NAME_TRANSLATION_KEY',
            feature_flag: 'PAGE.TOPICS.EDIT',
            order: 0,
            icon: Icon,
            pageType: NORMAL,
            properties: {
                'data-ui-id': 'TOPICS.EDIT'
            },
            requiresMinimum: {  // minimum requirements of this page - if either `backendSupportFor` or `authorizationOf` are not completely satisfied, `contentComponent` will not be used for this route - instead a 404 (backendSupportFor) or 403 (authorizationOf) page will be shown to the user on access. These are minima - a panel may still need to check for additional support to enable/disable capability it provides
                backendSupportFor: {
                    Topic: { create, read, update, delete } // page requires the backend to support the ability to 'create', 'read', 'update' and 'delete' a 'Topic' at minimum to function
                },
                authorizationOf: {
                    Topic: { create, read, update, delete }, // user requires minimum Topic 'create', 'read', 'update' and 'delete' privileges to make use of this page
                    Group: { read } // user requires minimum consumer group 'read' privilege to make use of this page
                }
            }
        },
        {
            path: '/topics',
            name: 'TOPICS_NAME_TRANSLATION_KEY',
            feature_flag: 'PAGE.TOPICS',
            order: 0,
            icon: Icon,
            pageType: NORMAL,
            properties: {},
            requiresMinimum: {
                backendSupportFor: {
                    Topic: { read} // page requires the backend to support the ability to 'read' a 'Topic' at minimum to function
                },
                authorizationOf: {
                    Topic: { read }, // user requires minimum Topic 'read' privilege to make use of this page
                    Group: { read } // user requires minimum consumer group 'read' privilege to make use of this page
                }
            }
        },
    ]
}
```

Where:

- `contentComponent` - binds a panel to each page `context` in the contexts array. This can ether be a module (meaning the panel will be included in the main bundle) or a function, which will then be integrated with React Suspense/Lazy to asynchronously load the panel when required
- `contexts[X].path` - path/location of this page. Used as a unique identifier, two `contexts` should have the same path.
- `contexts[X].name` - translation key which maps to the name for this page, which will be shown (as required) by the navigation
- `contexts[X].feature_flag` - the feature flag to check for to enable or disable this page - more details to follow in/as a part of https://github.com/strimzi/strimzi-ui/issues/13
- `contexts[X].order` - numeric value to enable sorting if when processed there are peers to this page, and a specific ordering is desired
- `contexts[X].Icon` - a page may wish to have an icon to identify it in top level navigation, or at sub levels when there are many peers. If required this should be a React component representing the Icon, else `undefined`
- `contexts[X].pageType` - a description of the type ([as defined here](../Bootstrap/Navigation/README.md#page-types)) of page this is. The Navigation will then render (or not) supporting visual elements, such as the first or second level navigation, depending on this type
- `contexts[X].properties` - an object which will be spread over the `contentComponent` on render. This can be used to provide static, `context` specific properties to components (to trigger a particular mode for example).
- `contexts[X].requiresMinimum.backendSupportFor` - the minimum requirements for a backend to support so this page can function. If these are not met, the route will redirect to a `404 Not Found` error page, rather than the panel provided via `contentComponent`. The format of this value is described [here](../../docs/Architecture.md#entity-model), and will be validated against the backend [GraphQL Schema via Introspection](../../docs/Architecture.md#introspection).
- `contexts[X].requiresMinimum.authorizationOf` - the minimum requirements a user requires to access this page. If these are not met, the route will redirect to a `403 Not Authorized` error page, rather than the panel provided via `contentComponent`. The format of this value is described [here](../../docs/Architecture.md#entity-model), and will be validated against the [UI's authorization model](../../docs/Architecture.md#security).

## Test approach

To be defined in https://github.com/strimzi/strimzi-ui/issues/7

## Current pages

This section provides a summary of the currently provided modules, and the pages they represent:

| Module                | Panel used | Included in main bundle? | Path used              | Summary                                                                                                                                                                                                                                                                                                                                             |
| --------------------- | ---------- | ------------------------ | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NoPages.page.ts       | TBD        | Yes                      | `/error/nopages`       | Page shown to a user when no pages (following introspection) can be shown to a user due to either a lack of supporting backend capability or if no pages have been configured to display via feature flags (these scenarios are edge cases). If a user cannot access any page due to a lack of authorization, they will see the NotAuthorized page. |
| NotFound.page.ts      | TBD        | Yes                      | `/error/notfound`      | Page shown to a user when either the URL they provide does not match a page we do not recognise or can show with the current backend                                                                                                                                                                                                                |
| NotAuthorized.page.ts | TBD        | Yes                      | `/error/notauthorized` | Page shown to a user when either they do not have the correct authorization to access a page in the UI                                                                                                                                                                                                                                              |

_Note_: Above metadata to be implemented in a following PR, but is representative of the structure expected here, and what purpose/capability they should provide.

## Expected files

For a given set of page metadata `Topics` for a topics page, the expected files are as follows:

```
Pages/
  index.ts
  README.md
  Topics.page.ts
  ...
```

Where:

- index.ts acts as a barrel file, exporting all page metadata defined in this module as the public API for what pages are available for use
- README.md is this readme
- Topics.page.ts contains the module which exports page metadata
