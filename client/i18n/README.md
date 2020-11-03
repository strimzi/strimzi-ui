# Internationalisation (i18n)

This project uses `i18next` with `react-i18next` to provide internationalization of content. Human readable content should not be used directly in React components. Instead, they should be looked up using `react-i18next` - which will ensure the content is localized. The library also supports interpolation of dynamic values and formatting of the output. `eslint-plugin-i18next` is used to ensure that JSX cannot be written that contains text without a translation.

## Usage

The `useTranslation` hook provides a `t(key, options)` function - that takes a translation key and (optional) options and returns the translated content. See [https://www.i18next.com/translation-function/essentials](https://www.i18next.com/translation-function/essentials) for more details. An object hash containing values for interpolation can be supplied as the second parameter to `t` instead of a full options object.

For readability purposes, `t` should be renamed to `translate` or equivalent.

```tsx
import {useTranslation} from 'react-i18next';
...
export const myComponent = () => {
    const {t: translate} = useTranslation();
    return (
        <>
            <div>{translate('my.key')}</div>
            <div>{translate('with.inserts', {valueToInsert: "test"})}</div>
        </>);
}
```

### Providing translation values

`Bootstrap/i18n.ts` configures the `i18next` library to load translations from `./index.ts`.

`index.ts` exports an Object containing translations from `<language>.json`.

`<language>.json` contains the following shape - where `{{key}}` is substituted using a matching key in the inserts passed to `translate()`:

```json
{
  "my": {
    "key": "value"
  },
  "with": {
    "inserts": "This has a {{valueToInsert}}"
  }
}
```

#### Fallback

If you're using the `t` function - the key will be rendered if the translation is missing in the desired language or any fallbacks. Inserts are ignored.

If you're using the `Trans` component, any children will be rendered but not the `i18nkey` prop.

## Basic formatting in translations

The `<Trans>` component can be used to render translated messages that contain basic formatting tags - `<br>, <strong>, <i>, <p>` can all be embedded directly into the translation string. `<Trans>` takes `translate` as a property `t` to allow it to re-render when language changes. `i18nKey` is passed in to point to the right translation. Inserts are passed as singleton key:value objects.

```tsx
import { Trans, useTranslation } from 'react-i18next';
export const myComponent = () => {
  const { translate } = useTranslation();
  return (
    <>
      <div>
        <Trans t={translate} i18nKey='simple.format'></Trans>
      </div>
      <div>
        <Trans t={translate} i18nKey='with.inserts'>
          {{ insert: 'value1' }}
          {{ another: 'value2' }}
        </Trans>
      </div>
    </>
  );
};
```

### Providing translation values

```json
{
  "simple": {
    "format": "This is a <strong>value</strong>"
  },
  "with": {
    "inserts": "This has an <i>{{insert}}</i> and {{another}}"
  }
}
```

## Advanced formatting

The `<Trans>` component also supports interpolation of JSX elements into the translated string to provide additional formatting (e.g class names, headers, links) around the string content. These elements must be passed as children to `<Trans>`. Dynamic content should be supplied after elements as singleton children as before.

```tsx
import { Trans, useTranslation } from 'react-i18next';
export const myComponent = () => {
  const { t: translate } = useTranslation();
  return (
    <>
      <div>
        <Trans t={translate} i18nKey='with.link'>
          <a href='.' />
        </Trans>
      </div>
      <div>
        <Trans t={translate} i18nKey='with.classname'>
          <div className='bold' />
          {{ topic: 'mytopic' }}
        </Trans>
      </div>
      <div>
        <Trans t={translate} i18nKey='with.custom'>
          <MyComp prop='value' />
          <SecondComp />
        </Trans>
      </div>
    </>
  );
};
```

### Providing translation values

Each element is referenced in the translation file by its array index (children in React ultimately are passed as an array). Elements can be used standalone (no children) or they can wrap content (content passed as single child to the component. _The content will replace any children in the element._)

```json
{
  "with": {
    "link": "This is a <0>link</0>",
    "classname": "You have created topic <0>{{topic}}</0>",
    "custom": "This is a custom component: <0/> with <1>another custom component</1>"
  }
}
```

### Notes/Findings with advanced formatting

`eslint-plugin-i18next` will not flag content in `<Trans>` - this is because it will only be written to the page if you include it in your interpolated tranlsation string.

For example with translation file `{key: "Some unrelated text"}` - `<Trans t={t} i18nKey="key">This is a <MyComp>custom component</MyComp></Trans>` would render `Some unrelated text` because the children are not being used in the translation string with key `key`.

However with translation file `{key: "Insert <0/> here and <0>also here</0>"}` - `<Trans t={t} i18nKey="key">This is text with a <a href="">link</a></Trans>` would render `Insert This is text with a here and This is text with a`. This is because string `This is text with a ` is child `0`.

To avoid any confusion, `<Trans>` components must only have self closing elements `<MyComp/>` and `{key:value}` tuple objects as children.
