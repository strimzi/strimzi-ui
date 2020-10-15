# Continuous Integration

This repo makes use of GitHub Actions to run various checks to aid maintaining this repo. Actions allow us to run certain checks on PRs, maintain our dependencies, and have automatic issue checking. All code for workflows and actions can be found in the `.github` directory at the root of this repository.

## Automatic tests

To make sure that master branch is alway safe, all of our tests for the UI are run on each pull request. For full details on our tests, [view our testing documentation](./Test.md). The output of the tests run by Jest can be viewed in the logs of the action on a pull request. For E2E tests, the results are also available in the logs, and the failure output will be uploaded as an artifact on the action. These can be downloaded via the `Artifacts` dropdown at the top right of the action page.

### Test coverage information

As part of automatically running the tests, if they fail because of insufficient test coverage, the coverage report from the tests are formatted as a report on the pull request. This way, it is easy to see where the coverage requirements have not been met and is a quick way to let a contributer know what needs to be done. If the tests pass, no report will be given.

## Bundle size calculation

It is important that we maintain as small as a bundle size as possible. To help with this, a bundle size report will be made on a pull request that shows the new size of the bundle and the percentage increase/decrease in size. By having this report, maintainers can easily raise questions if the size of the bundle changes dramatically.

## Linting

All of our linting tools will run on a PR. To see what linting we enforce, [view our linting documentation](./Linting.md). These checks should not be an issue as they are automatically run when `git commit` is run on this repo. However, this prevents problems from anything that hasn't been checked in correctly.

## GitHub Pages

On merge to master, a hosted version of the project storybook will be available to view on GitHub pages.

## Stale Issue/Pull Request Management

To prevent this repo from filling with stale issues and pull requests, we make use of an action that will automatically flag old issues and pull requests as stale. If, after 30 days, the issue/pr is still open, it will automatically be closed. The action that manages this can be found [here](https://github.com/marketplace/actions/close-stale-issues). An issue/pr will become stale after 14 days of no activity. If there is no activity for a further 5 days, it will be deleted.
