# Panel

A `Panel` component represents a top level element of a UI, such as an entire page, or significant capability of a page. A `Panel`s responsibility is not only to compose `Element` and `Group` components to implement the required UI, but to own and manage activities such as data fetching, state reduction, integration with the wider UI and so on. For example, a `Panel` would on mount make a request for and own the response for a piece of data, and while this request is happening, swap in and out `Group` and or `Element` components to represent the loading/error/success states.

## Test approach

To be defined in https://github.com/strimzi/strimzi-ui/issues/7

## Expected files

For a given Panel component `Foo`, the expected files are as follows:

```
Panel/
  index.js
  Foo/
    index.js
    README.md
    View.js
    Model.js
    Styling.scss
```

Where:

- index.js acts as a barrel file, exporting all public elements of this component/the components in the Panel directory
- README.md is the readme for this component, detailing design choices and usage
- View.js is the view logic for this component
- Model.js (_optional_) is the model (business) logic for this component
- Styling.scss (_optional_) is the styling for this component

## Components

Components to be added here on implementation, with summary of purpose/usage and a link to it's README.
