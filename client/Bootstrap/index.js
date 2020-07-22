/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import './index.css';
import image from 'Images/logo.png';

window.addEventListener('load', () => {
    const root = document.querySelector('[id="root"]');
    const img = document.createElement('img');
    img.src = image;
    img.alt = 'Strimzi logo';
    root.append(img);
    root.append(document.createTextNode('Welcome to the Strimzi UI'));
});