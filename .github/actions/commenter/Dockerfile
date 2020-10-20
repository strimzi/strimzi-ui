# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
FROM node:slim

COPY index.js .
COPY package.json .
COPY package-lock.json .

RUN npm install

ENTRYPOINT ["node", "/index.js"];
