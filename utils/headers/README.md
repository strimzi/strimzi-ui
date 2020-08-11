<!--
 Copyright Strimzi authors.
 License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
-->

# Headers

This directory contains files with copyright/header statements which will be programmatically added to all source files. These headers are applied at build time to all built output, and at lint time via the `npm run lint:allfiles` script. Files in this folder should be:

- Be named sensibly (ie StrimziHeader contains the Strimzi header text)
- Be `.txt` files so [`constants.js`](../constants.js) can discover and include all headers in built output.
