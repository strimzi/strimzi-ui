/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import image from 'Images/logo.png';
import React, { ChangeEvent, FunctionComponent } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import i18next from 'i18next';
type ButtonProps = {
  prop: string;
};

const Button: FunctionComponent<ButtonProps> = ({ children, prop }) => {
  return (
    <button>
      <div>{prop}</div>
      {children}
    </button>
  );
};

const changeLang = (change: ChangeEvent<HTMLSelectElement>) => {
  document.querySelector('html')?.setAttribute('lang', change.target.value);
  i18next.changeLanguage('');
};

const langs = ['en', 'de'];

const Home: FunctionComponent = () => {
  const { t: translate } = useTranslation();
  const insert = 'inserted value';
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <img src={image} />
      <div>{translate('home.basic')}</div>
      <div>{translate('home.insert', { insert })}</div>
      <div>
        <Trans t={translate} i18nKey='home.formatted' />
      </div>
      <div>
        <Trans t={translate} i18nKey='home.formattedInsert'>
          {{ insert }}
          {{ another: 'test' }}
        </Trans>
      </div>
      <div>
        <Trans t={translate} i18nKey='home.customInserts'>
          <div className='x' />
          <strong>Hello</strong>
          <i />
          <a title={translate('link')} href='http://google.com' />
          {{ insert }}
        </Trans>
      </div>
      <div>
        <Trans t={translate} i18nKey='home.customContent'>
          <Button prop='hello'>
            <b>test</b>This text will not render
          </Button>
        </Trans>
      </div>
      <select onChange={changeLang}>
        {langs.map((lang) => (
          <option label={lang} value={lang} key={lang} />
        ))}
      </select>
    </div>
  );
};
export { Home };
