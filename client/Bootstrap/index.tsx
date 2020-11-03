/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import './style.scss';
import { init } from 'i18n';
import ReactDOM from 'react-dom';
import React from 'react';
import { Home } from 'Panels/Home';

init(); //Bootstrap i18next support
ReactDOM.render(<Home />, document.getElementById('root'));
