/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { ReactNode, ReactElement, ReactNodeArray } from 'react';

const stringify: (node: ReactNode) => string = (node) => {
  if (!node) {
    return '';
  }

  if ((node as ReactElement).props) {
    const props = Object.entries((node as ReactElement).props)
      .filter(([key]) => key !== 'children')
      .reduce(
        (currentProps, [prop, value]) =>
          `${currentProps} ${prop}=${JSON.stringify(value)}`,
        ''
      );

    return `"<${(node as ReactElement).type} ${props.trim()}/>"`;
  }

  return node.toString();
};

/**
 * Very primitive check - react-i18n inserts objects are single key/value
 * @param node
 */
const isCustomElement: (node: ReactNode) => boolean = (node) => {
  if (typeof node !== 'object' || !node) {
    return false;
  }

  if (Array.isArray(node)) {
    return false;
  }

  //Mini workaround - inserts objects in `react-i18n` must have a single key
  return Object.keys(node).length > 1;
};

export const translate: (
  key: string,
  options?: Record<string, unknown>
) => string = (key, insertsObj) => {
  let inserts = '';

  if (insertsObj) {
    inserts = JSON.stringify(
      insertsObj.inserts ? insertsObj.inserts : insertsObj
    );
  }

  return `key:"${key}"${inserts ? ` inserts:${inserts}` : ''}`;
};

export const translateWithFormatting: (
  key: string,
  children: ReactNode
) => string = (key, children) => {
  const elements: Array<string> = [];
  const inserts: Array<string> = [];

  const processChild: (child: ReactNode) => void = (child) => {
    if ((child as ReactNodeArray).length) {
      return;
    }

    if (isCustomElement(child)) {
      elements.push(stringify(child));
    } else {
      inserts.push(JSON.stringify(child));
    }
  };

  if (children) {
    //Handle top level array only
    if ((children as ReactNodeArray).length) {
      (children as ReactNodeArray).forEach(processChild);
    } else {
      processChild(children);
    }
  }

  return `key:"${key}"${elements.length ? ` elements:[${elements}]` : ''}${
    inserts.length ? ` inserts:[${inserts}]` : ''
  }`;
};
