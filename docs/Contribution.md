# Contribution

## Linting rules applied

For full details on what linting is applied, [view our linting documentation](./Linting.md).

## Providing and Updating READMEs

Each area of this codebase has a README that goes alongside it that thouroughly explains the context and functionality of that area. When an area of code is updated, the README should also be updated to reflect the changes. If a new area is being added (e.g. a new panel), that area should also include a new README that explains it. Then, the appropriate related READMEs should be updated to have links to the new documentation.

## Development Method

All components in this repository should be developed using Test Driven Development or Behaviour Driven Development. This ensures that code is only being written that adds value to the end user. By following the TDD or BDD structure properly, it should make refactoring safe to do and ensure that regressions can be avoided as much as possible. For more details on writing tests in this repo [view our test documentation](./Test.md).

## Components should be functional

As detailed in the [architecture documentation](./Architecture.md), all react components should be functional components whos model logic is provided purely through Hooks. This allows us to follow the MVC pattern and gives us the power to use swappable view layers as all views are responsible for **only** rendering.

## Use Contexts for state management

Any data that needs to be shared across components that can exist as state should be put into a context. Contexts allow data to be provided at a higher level and then consumed by any child component that wants access to it. This is a much cleaner solution to prop-drilling and other libraries such as react-redux. [View the context documentation here](../client/Contexts/README.md).

## All components should have a Storybook

Every component should also come with a detailed Storybook. They should have appropriate knobs and actions that show the full capability of the component. Developing components with Storybook is a great way to make sure most of this gets done as part of the process, instead of being an afterthough. For more details on Storybook [view our Storybook documentation](./Architecture.md#storybook).

## Component Conventions

We have defined four main types of components that make up the UI: Elements, Groups, Panels, Pages, and Bootstrap. These defnitions allow us to clearly split up complexity and allow for maximum modularity of the UI. For full information about why we use this structure [view our architecture documentation](./Architecture.md#element-group-panel-bootstrap-component-pattern)

## CSS should be written using the block-element-modifier (BEM) naming convention

All CSS in this project is written using the BEM naming convetion. We chose BEM for a variety of reasons

- It is a widely used convention that should be quick to pick up my most experienced UI developers.
- It makes JSX much more readable when the styling applied can be derived from the class names.
- It should help reduce duplicate CSS as common styles will already be defined.

To help enforce the BEM naming convention, we have enabled the [stylelint-selector-bem-pattern](https://www.npmjs.com/package/stylelint-selector-bem-pattern) plugin.

## Component CSS should live in its own namespace

As this project uses SCSS as a CSS precompiler, it makes namespacing CSS easy. Each component should silo off its own CSS by encapsulating the file in a single class that matches the name of the component. For example, the JSX would look like this:

```
<div className={'myComponent'}>
  <button className={'button-primary'}>I am a child element</button>
  // other children
</div>
```

And the corresponding SCSS should look like this:

```
.myComponent{
  .button-primary {

  }
  // other child css
}
// EOF
```
