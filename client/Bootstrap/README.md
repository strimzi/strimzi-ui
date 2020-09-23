# Bootstrap

This directory contains all code required to bootstrap the UI. This will include the build entry point `index.js` ([for further details, see build documentation](../../docs/Build.md)), `index.html` template which will ultimately be returned the to the user when the access the UI, as well as all the React components that set up initial UI state and represent UI level behaviours, such as Navigation or user management.

While it's own directory, the code in this directory should be tested and developed in the same manner as a [`Panel`](../Panels/README.md) component, but additionally make use of user story end to end tests, which drive the whole UI to achieve the stated user goals.

## Test approach

Bootstrap should be tested in a behavioural manor. See [Behavioural test style](../../docs/Test.md#behavioural-test-style).

## Expected files

For a given Bootstrap component `Navigation`, the expected files are as follows:

```
Bootstrap/
  index.js (*)
  index.html
  Navigation/
    index.js (**)
    README.md
    View.js
    Model.js
    Styling.scss
```

Where:

- index.js (\*) acts as the build (and thus client) entry point
- index.html is the HTML template file which is used to
- index.js (\*\*) acts as a barrel file, exporting all public elements of this component
- README.md is the readme for this component, detailing design choices and usage
- View.js is the view logic for this component
- Model.js (_optional_) is the model (business) logic for this component
- Styling.scss (_optional_) is the styling for this component

## Components

Components to be added here on implementation, with summary of purpose/usage and a link to it's README.
