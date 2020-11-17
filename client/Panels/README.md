# Panels

A `Panel` component represents a top level element of a UI - the primary/significant capability of a page. A `Panel`s responsibility is not only to compose `Element` and `Group` components to implement the required UI, but to own and manage activities such as data fetching, state reduction, integration with the wider UI and so on. For example, a `Panel` would on mount make a request for and own the response for a piece of data, and while this request is happening, swap in and out `Group` and or `Element` components to represent the loading/error/success states.

## Test approach

Bootstrap should be tested in a behavioural manor. See [Behavioural Driven Development](../../docs/Test.md#style-of-test).

## Expected files

For a given Panel component `Topics`, the expected files are as follows:

```
Panels/
  index.ts
  types.ts
  Topics/
    index.ts
    README.md
    View.ts
    Model.ts
    Styling.scss
    Topics.feature
    Topics.steps.ts
    Topics.assets.ts
    Topics.types.ts
```

Where:

- index.ts acts as a barrel file, exporting the public API of this component/component bundle.
- types.ts acts as a barrel file, exporting all the public types of each context
- README.md is the readme for this component, detailing design choices and usage
- View.ts is the view logic for this component
- Model.ts (_optional_) is the model (business) logic for this component
- Styling.scss (_optional_) is the styling for this component
- Topics.feature is the test definition file for this page
- Topics.steps.ts are the steps for the feature definition
- Topics.assets.ts are the test assets for this page
- Topics.types.ts are the types for this page

## Components

Components to be added here on implementation, with summary of purpose/usage and a link to it's README.
