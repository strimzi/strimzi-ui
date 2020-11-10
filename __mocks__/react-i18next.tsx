/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { translate, translateWithFormatting } from 'utils/test/i18n';
import { TFunction } from 'i18next';
import React, { FunctionComponent } from 'react';
import { UseTranslationResponse } from 'react-i18next';

const i18next: jest.Mock = jest.createMockFromModule('react-i18next');

const useTranslation = () => {
  const trans = translate as TFunction;

  const hookResult = [translate, null, true];
  // eslint-disable-next-line id-length
  (hookResult as UseTranslationResponse).t = trans;

  return hookResult;
};

const Trans: FunctionComponent<{ i18nKey: string }> = ({
  i18nKey,
  children,
}) => <div>{translateWithFormatting(i18nKey, children)}</div>;

module.exports = { ...i18next, useTranslation, Trans };
