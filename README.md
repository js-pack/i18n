# @js-pack/i18n

easy-to-use translation library

This is gettext style, very-lite i18n library. You don't need to define keys as constants. You can choose your default language (defaultLocale) for code, once you did this, you are ready-to go. Strings you used in translation functions are already your keys.

## Initialization

```typescript
import { t, init, setLocale } from '@js-pack/i18n';

init({
  locale: 'tr-TR',
  defaultLocale: 'tr-TR',
  supportedLocales: ['tr-TR', 'en-US'],
  resourceMap: {
    'en-US': {
      'selam!': 'hello!',
      'hos geldin {{user}}': 'welcome {{user}}',
    },
  },
});
```

After initialization, usage is like following;

```typescript
t('selam!'); // selam!
t('hoş geldin {{user}}', { user: 'engin' }); // hoş geldin engin

// set locale
setLocale('en-US');

t('selam!'); // hello!
t('hoş geldin {{user}}', { user: 'engin' }); // welcome engin
```

> defaultLocale does not mean fallback language. It points to main language which will be used for key strings in code. Let's see with an example;

```typescript
import { t, init } from '@js-pack/i18n';

init({
  locale: 'en-US',
  defaultLocale: 'en-US',
  supportedLocales: ['tr-TR', 'en-US'],
  resourceMap: {
    'tr-TR': {
      'hello!': 'selam!',
      'welcome {{user}}': 'hoş geldin {{user}}',
    },
  },
});
```

We are now using US English as a main **key** language for our `t` (translate) function.

```typescript
t('hello!'); // selam!
t('welcome {{user}}', { user: 'engin' }); // hoş geldin engin

// set locale
setLocale('en-US');

t('hello!'); // hello!
t('welcome {{user}}', { user: 'engin' }); // welcome engin
```

## Plural Usage

`count` is a special property to define plurality. We can specify individual translations for all counts `key_{{count}}`. Available keys are;

- `key`
- `key_0`
- `key_1`
- ...
- `key_n`
- `key_plural`

Key will be matched specified count as a default. If there is no specified key with count but `_plural`, in case of `count > 1`, `_plural` key will be matched. For other counts including zero `key` will be matched.

```typescript
///...
resourceMap: {
  'tr-TR': {
    'uygulamada kayıtlı {{count}} kullanıcı bulunmaktadır': '',
    'uygulamada kayıtlı {{count}} kullanıcı bulunmaktadır_plural': '',
    'uygulamada kayıtlı {{count}} kullanıcı bulunmaktadır_0': '',
    'uygulamada kayıtlı {{count}} kullanıcı bulunmaktadır_1': '',
    'uygulamada kayıtlı {{count}} kullanıcı bulunmaktadır_2': '',
    // ...
    'uygulamada kayıtlı {{count}} kullanıcı bulunmaktadır_n': '',
  },
  'en-US': {
    'uygulamada kayıtlı {{count}} kullanıcı bulunmaktadır': 'there is {{count}} user registered in this application',
    'uygulamada kayıtlı {{count}} kullanıcı bulunmaktadır_plural': 'there are {{count}} users registered in this application',
    'uygulamada kayıtlı {{count}} kullanıcı bulunmaktadır_0': 'there is no user registered in this application',
  },
},
///...
```

## Context Usage

```typescript
'en-US': {
  'arkadaş': 'friend',
  'arkadaş_erkek': 'boyfriend',
  'arkadaş_kız': 'girlfriend',
},
```

Sample

```typescript
setLocale('en-US');

t('arkadaş'); // friend
t('arkadaş', { context: 'erkek' }); // boyfriend
t('arkadaş', { context: 'kız' });); // girlfriend
```

> We can also combine context and plural.

```typescript
'en-US': {
  'arkadaş': 'friend',
  'arkadaş_erkek': 'boyfriend',
  'arkadaş_kız': 'girlfriend',
  
  '{{count}} arkadaş_erkek_0': 'no boyfriends',
  '{{count}} arkadaş_erkek_1': '{{count}} boyfriend',
  '{{count}} arkadaş_erkek_plural': '{{count}} boyfriends',
},
```

Sample

```typescript
setLocale('en-US');

t('{{count}} arkadaş', { context: 'erkek', count: 0 }); // no boyfriends
t('{{count}} arkadaş', { context: 'erkek', count: 1 }); // 1 boyfriend
t('{{count}} arkadaş', { context: 'erkek', count: 5 });); // 5 boyfriends
```