/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import 'Styling';
import image from 'Images/logo.png';

const onLoad: () => void = () => {
  const root =
    document.querySelector('[id="root"]') || document.createElement('div');
  const img = document.createElement('img');
  img.src = image;
  img.alt = 'Strimzi logo';
  root.append(img);
  root.append(document.createTextNode('Welcome to the Strimzi UI'));
};

window.addEventListener('load', onLoad);
