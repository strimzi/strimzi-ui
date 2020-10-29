# Test

Tests serve many different purposes. They can:

- Validate the requirements/expectations of stakeholders are met
- That an end user can achieve their goal
- Act as documenatation/reference material
- Confirm integration works as expected between areas of function
- Validate we do not regress functionality or behaviour we care about

We want to enable and achieve all of these goals in the UI testing done in this
repo. To this end, we require, depending on the functionality being added or
changed, different types of tests. The types of test expected, and the
rationale for these are detailed below.

## Style of test

We have two approaches of testing at the unit level - `Behavioural driven development`
and standard `Test driven development`.

`Behavioural driven development` tests focus on exactly that - behaviour. They
do not target individual functons, but instead test an end to end behaviour
(and all the functions which contribute to it), and validate that for a given
set of actions or inputs, that the expected output/end goal is met. These
behaviours should focus on the user of the component. Depending on the type of
code being developed, the user may be another developer (using the component
for example) or the end user of the UI.

`Test driven development` tests conversely target individual functions in a
more traditional unit test style - validating that for a given input, the
expected output is returned.

Both styles of test should live in the same directory as the components they
are testing.

Depending on the code being covered, the tools used to enable these test styles
may be different, as detailed below.

### Test Driven Development

Code in the following directories are expected to be driven by standard test
driven development. They use _Jest_ as a test runner, using standard Jest
test assets, such as `describe`, `it` and `expect`:

- `client/Hooks`
- `client/Contexts`

### Behavioural Driven Development

Code in the following directories are expected to be driven by behavioural
driven development. They use _Jest_ as a test runner, with _jest-cucumber-fusion_
to link jest and cucumber. Jest `expects` and all aspects of `RTL` can still be
used to test React code:

- `client/Elements`
- `client/Groups`
- `client/Panels`

Common step definitions should be defined in `test_common/jest_cucumber_support/common_stepdefs.ts`.

### Server Testing

The strimzi-ui server should be tested by driving requests to the server, as a user would (indirectly) through via the UI. It should be tested behaviorally, using _Jest_ and _Cucumber_ interacting with a [`supertest`](https://github.com/visionmedia/supertest) instance of the server. Test feature files will reside in their respective modules, and common server test step code is kept in `server/test`.

### End to End testing

End to End tests should exercise a user scenario - focus on the behaviour a
user will take to interact with the application to achieve an end goal.

They should be fairly coarse grained, exercising multiple pages/panels as
necessary.

For example - "I can navigate to the topics page and see a list topics", or "I
can navigate to a topic and view its consumers".

These tests are using _cypress_ as a test runner and to drive assertions.
Cypress tests should be written like how a user would interact with the browser
when using the UI.

To avoid the temptation to correlate scenarios with particular panels, these
tests are located in the `e2e/features` directory.

The e2e tests are written using [Gerkin](https://cucumber.io/docs/gherkin/reference)
syntax. Your `.feature` file should live inside `e2e/features`. The steps are
written inside `e2e/features/step_definitions`. Definition files are written using
[cypress-cucumber-preprocessor](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor).

On failure - the `e2e/failure_output/screenshots` and `e2e/failure_output/videos`
directories will contain a capture of the page at failure time, and a
recordings of the test until failure.

## Writing a test

In all styles of test, we will look for the following factors. These are to
confirm the test is clean and will be reliable:

- Date and time should be mocked/set to a known value
- Tests should cause no side effects - they should create and delete any
  resources they need in the scope of that test/test suite
- Tests (regardless of style) should be structured in the following way:
  1. Perform any required setup
  2. Perform an action (or actions)
  3. Assert the result
  4. Perform any required clean up

## Code coverage

In this repo, we aim to have 100% code coverage across all components. This code
coverage should be achieved through useful functional/behavioural tests and
not just units to increase the coverage. We want all lines to be verified
through meaninful tests. Code coverage should be used as a tool to help spot
where certain tests may have been overlooked.

## Accessibility testing

To be discussed at https://github.com/strimzi/strimzi-ui/issues/20

## Test tooling used

The current set of tooling used to implement tests can be found below. In
addition to this set, a library of [test utilities exist](../utils/test/README.md)
to help enable the fast and reliable creation and maintaince of tests going
forwards.

The current testing tooling used for UI code is as follows:

- [Jest](https://jestjs.io/) - as a test runner. Used to run functional and behavioural tests
- [RTL (react-test-library)](https://testing-library.com/docs/react-testing-library/intro) - used to emulate a browser DOM and mimic
  user interaction with React components
- [Cypress](https://www.cypress.io/) - as an end-to-end test runner
- [cypress-cucumber-preprocessor](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor) - as a step definition library

## Test utilities

Where possible, single responsibility test utilities should be created
to abstract common test logic so that it can be easily re-used and lifts
the barrier to entry to write new tests. These utilities should have simple
function signatures that are well documented. Once implemented these should
not be changed so that function complexity does not grow. If additional behaviour
is required later on, these should be extended through new utility functions.

View all test utility documentation [here](../test_common/README.md).
