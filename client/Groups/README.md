# Groups

`Group` components are one or more `Element` components combined and composed together to provide a larger piece of UI. They can own an manage their own state and business logic via a Model if required, and use then use that state (via properties) in the child `Element` components used in this `Group`. By doing this, the `Group` component can act as a layer of abstraction between `Element` components which build up the `Group`, and the `Panel` (and it's global state/data fetching logic for example) the `Group` is used in. This keeps the `Element` and `Group` components as composable as possible, while keeping `Panel` logic together.

## Test approach

Bootstrap should be tested in a behavioural manor. See [Behavioural Driven Development](../../docs/Test.md#style-of-test).

## Expected files

For a given Group component `HeadingWithToggle`, the expected files are as follows:

```
Groups/
  index.ts
  HeadingWithToggle/
    index.ts
    README.md
    View.ts
    Model.ts
    Styling.scss
```

Where:

- index.ts acts as a barrel file, exporting all public elements of this component/the components in the Groups directory
- README.md is the readme for this component, detailing design choices and usage
- View.ts is the view logic for this component
- Model.ts (_optional_) is the model (business) logic for this component
- Styling.scss (_optional_) is the styling for this component

## Components

Components to be added here on implementation, with summary of purpose/usage and a link to it's README.
