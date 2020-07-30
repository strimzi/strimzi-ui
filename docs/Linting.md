# Linting

To maintain a consistent code style, as well as follow best practise, linting has been set up for this codebase. This document will cover what tools are used to lint this codebase, how they are configured, and what rules are in place to maintain a common style and approach.

## Tools used

These are the tools used to lint this codebase, along with what areas they are responsible for:

| Tool        |  Used for  |
| ------------- |  -----:|
| [Husky](https://github.com/typicode/husky) | Git hook integration. Allows the running of the below linting checks at various points of the git lifecycle. |
| [commitlint](https://commitlint.js.org/) | [Git commit checks](#Git-commit-checks) |
| [eslint](https://eslint.org/) | [JS/React/a11y best practise/style enforcement](#JS-code) |
| [stylelint](https://stylelint.io/) | [Styling (css, scss) code style enforcement](#scss-/-css-code) |
| [prettier](https://prettier.io/) | [Code format enforcement](#code-style) |

For JS and SCSS/CSS code, the intent is to have a dedicated tool (ie `eslint`, `stylelint`) to enforce best practice/syntax rules, but both to delegate/integrate code formatting resposibilities to `prettier`.

## Linting implementation and config

All configuration and any implementation for linting in this codebase is available [here.](../utils/linting). The configuration is deliberately modular to allow easy modification if required. These are then referenced and used in the top level `package.json` so they can be driven via npm scripts.

## Linting rules

This section will detail the rules implemented across the codebase, and a rationale to why these rules have been chosen. Apart from the [Git commit checks](#Git-commit-checks), all linting will occur pre commit, via a Husky hook. Alternatively, a developer can run these pre commit checks by running:

```
npm run lint
```

to run all checks, or for individual lint checks, the command mentioned in each section respectively.

To pass linting, no errors or warnings are allowed - ie all rules must be satisfied. It is possible to override and ignore rules, but this should only be done as a last resort, with an accompanying explanation.

### All files

The following rules are applied to all files:

| Rule/Ruleset        |  Rationale  |
| ------------- | -----:|
| Must have the Strimzi copyright header (in the appropriate format) at the top of the file | Requirement for all code contributed to Strimzi |

These checks are enforced by `eslint`, and the configuration [here](../utils/linting/eslint-all-files.conf.js).

If required, these checks can be run manually by running `npm run lint:precommit`. Where possible, `eslint` will auto fix issues as they are discovered.

### Git commit checks
The following must be present in all git commits made to this repository. These rules are enforced by `commitlint`, and the configuration [here](../utils/linting/commitlint.conf.js), which are run as a post commit hook.

| Rule/Ruleset        |  Rationale  |
| ------------- |  -----:|
| All commits must have a signed-off-by entry | Required as an acknowledgement that the changes provided in that commit are the authors' own work, and that they have the permission to contribute this change |

These checks can only be run having made a `git commit`.

### JS code

These checks are enforced by `eslint`, and the configuration [here](../utils/linting/eslint.conf.js).

If required, these checks can be run manually by running `npm run lint:js`. Where possible, `eslint` will auto fix issues as they are discovered.

| Rule/Ruleset        |  Rationale  |
| ------------- |  -----:|
| eslint:recommended | Follow general best practise guidance offered from eslint |
| plugin:react/recommended | Provided via the React plugin. Enforce best practise around React code |
| plugin:react-hooks/recommended | Provided via the React hooks plugin. Enforce best practise around React Hooks |

- *Note:* Additional rules/rulesets to follow on agreement on code style - https://github.com/strimzi/strimzi-ui/issues/4 .

### SCSS / css code

These checks are enforced by `stylelint`, and the configuration [here](../utils/linting/stylelint.conf.js).

If required, these checks can be run manually by running `npm run lint:styling`. Where possible, `stylelint` will auto fix issues as they are discovered.

- *Note:* To follow on agreement on code style - https://github.com/strimzi/strimzi-ui/issues/4 .

### Code style

These checks are enforced by `prettier`, and the configuration [here](../utils/linting/prettier.conf.js).

If required, these checks can be run manually by running `npm run lint:format`. Where possible, `prettier` will auto fix issues as they are discovered.

- *Note:* To follow on agreement on code style - https://github.com/strimzi/strimzi-ui/issues/4 .