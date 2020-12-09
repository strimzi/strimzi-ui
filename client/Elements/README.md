# Elements

`Element` components are presentational React components: they take zero to many properties, and render content based on those properties. They should not contain or perform any business logic themselves, such as accessing state or making requests for data. They could however call callbacks provided to them to trigger these effects. By staying presentational, they thus become highly composable and reusable.

## Test approach

Bootstrap should be tested in a behavioural manner. See [Behavioural Driven Development](../../docs/Test.md#style-of-test).

## Expected files

For a given Element component `Heading`, the expected files are as follows:

```
Elements/
  index.ts
  types.ts
  Heading/
    index.ts
    README.md
    View.ts
    Styling.scss
    Heading.types.ts
    Heading.feature
    Heading.steps.ts
    Heading.assets.ts
```

Where:

- index.ts acts as a barrel file, exporting all public elements of this component/the components in the Elements directory
- types.ts acts as a barrel file, exporting all the public types of each element
- README.md is the readme for this component, detailing design choices and usage
- View.ts is the view logic for this component
- Styling.scss (_optional_) is the styling for this component
- Heading.types.ts are all the types for this component
- heading.feature is the feature definition to test this component
- Heading.steps.ts are the steps for the feature file
- Heading.assets.ts are the test assets for this component

## Components

Components to be added here on implementation, with summary of purpose/usage and a link to it's README.
