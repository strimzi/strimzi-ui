#!/bin/bash
# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
# generate 2 pairs of certificates and private keys for development purposes. Certificates valid for 1 year. Any valid certificate/key pair called `strimzi-ui-server` or `strimzi-ui-mock-admin` could be used for development, in present in the `generated/dev_certs/` directory
mkdir -p generated/dev_certs/
openssl req -days 365 -nodes -new -x509 -keyout generated/dev_certs/strimzi-ui-server.key -out generated/dev_certs/strimzi-ui-server.cert -config utils/dev_config/req.conf
openssl req -days 365 -nodes -new -x509 -keyout generated/dev_certs/strimzi-ui-mock-admin.key -out generated/dev_certs/strimzi-ui-mock-admin.cert -config utils/dev_config/req.conf