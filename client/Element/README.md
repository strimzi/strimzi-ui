# Element

`Element` components are presentational React components: they take zero to many properties, and render content based on those properties. They should not contain or perform any business logic themselves, such as accessing state or making requests for data. They could however call callbacks provided to them to trigger these effects. By staying presentational, they thus become highly composable and reusable.

## Test approach

To be defined in https://github.com/strimzi/strimzi-ui/issues/7

## Expected files

For a given Element component `Foo`, the expected files are as follows:

```
Element/
  index.js
  Foo/
    index.js
    README.md
    View.js
    Styling.scss
```

Where:

- index.js acts as a barrel file, exporting all public elements of this component/the components in the Element directory
- README.md is the readme for this component, detailing design choices and usage
- View.js is the view logic for this component
- Styling.scss (_optional_) is the styling for this component

## Components

Components to be added here on implementation, with summary of purpose/usage and a link to it's README.
