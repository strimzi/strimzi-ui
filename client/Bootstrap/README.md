# Bootstrap

This directory contains all code required to bootstrap the UI. This will include the build entry point `index.ts` ([for further details, see build documentation](../../docs/Build.md)), `index.html` template which will ultimately be returned the to the user when the access the UI, as well as all the React components that set up initial UI state and represent UI level behaviours, such as Navigation or user management.

While it's own directory, the code in this directory should be tested and developed in the same manner as a [`Panel`](../Panels/README.md) component, but additionally make use of user story end to end tests, which drive the whole UI to achieve the stated user goals.

## Test approach

The code in this directory should only be tested through End-to-End tests.
This is because these files do not contribute unit-level behaviour but have
an impact on the entire UI. This should help speed up development of bootstrap
code and unit testing at this level can be fiddly. See
[End-to-End testing](../../docs/Test.md#end-to-end-testing).

## Expected files

For a given Bootstrap component `Navigation`, the expected files are as follows:

```
Bootstrap/
  index.ts (*)
  index.html
  Navigation/
    index.ts (**)
    README.md
    View.ts
    Model.ts
    Styling.scss
```

Where:

- index.ts (\*) acts as the build (and thus client) entry point
- index.html is the HTML template file which is used to
- index.ts (\*\*) acts as a barrel file, exporting all public elements of this component
- README.md is the readme for this component, detailing design choices and usage
- View.ts is the view logic for this component
- Model.ts (_optional_) is the model (business) logic for this component
- Styling.scss (_optional_) is the styling for this component

## Components

- [`Navigation`](./Navigation/README.md) - responsible for all Navigation logic (both visual and logical) across the whole UI.
