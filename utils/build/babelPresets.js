/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
module.exports = [
  [
    '@babel/preset-env',
    {
      targets: {
        // Support the last two versions of Chrome, Edge, Firefox and Safari - https://babeljs.io/docs/en/babel-preset-env#browserslist-integration
        browsers: [
          'last 2 Chrome versions',
          'last 2 Edge versions',
          'last 2 Firefox versions',
          'last 2 Safari versions',
        ],
      },
    },
  ],
];
