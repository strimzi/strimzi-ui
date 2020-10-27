/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I am on the strimzi-ui homepage', () => {
  cy.visit('localhost:3000/index.html');
});

Then(`the welcome message appears`, () => {
  cy.get('#root').contains(`Welcome to the Strimzi UI`);
});
