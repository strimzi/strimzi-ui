/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import 'cypress-axe';
import { Result } from 'axe-core';

declare global {
  // eslint-disable-next-line
  namespace Cypress {
    // eslint-disable-next-line
    interface Chainable<Subject> {
      logA11yViolations(
        violations: Result[],
        target: string
      ): Chainable<Element>;
      testA11y(target: string): Chainable<Element>;
    }
  }
}

Cypress.Commands.add(
  'logA11yViolations',
  (violations: Result[], target: string) => {
    // pluck specific keys to keep the table readable
    const violationData = violations.map(
      ({ id, impact, description, nodes }) => ({
        id,
        impact,
        description,
        nodes: nodes.length,
      })
    );
    cy.log(
      'Accessibility violation',
      `${violations.length} accessibility violation${
        violations.length === 1 ? '' : 's'
      } ${violations.length === 1 ? 'was' : 'were'} detected ${
        target ? `for ${target}` : ''
      }`
    );
    cy.log('logTable', violationData);
  }
);

Cypress.Commands.add('testA11y', (target: string) => {
  cy.injectAxe();
  cy.configureAxe({
    rules: [
      { id: 'color-contrast', enabled: false }, // seem to be somewhat inaccurate and has difficulty always picking up the correct colors, tons of open issues for it on axe-core
      { id: 'focusable-content', enabled: false }, // recently updated and need to give the PF team time to fix issues before enabling
      { id: 'scrollable-region-focusable', enabled: false }, // recently updated and need to give the PF team time to fix issues before enabling
    ],
  });
  cy.checkA11y(
    undefined,
    {
      includedImpacts: ['serious', 'critical'],
    },
    (violations) => cy.logA11yViolations(violations, target),
    true
  );
});
