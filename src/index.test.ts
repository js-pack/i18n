import * as i18n from './index';

const supportedLocales = ['tr-TR', 'en-US'];

const trTR = {
  engin: '',
  '{{count}} engin_0': 'hic engin',
  '{{count}} engin_1': 'tek engin',
  '{{count}} engin_2': 'iki engin',
  '{{count}} engin_3': '{{count}} engin',
  '{{count}} engin_4': '{{count}} engin',
  '{{count}} engin_5': '{{count}} engin',
  '{{count}} engin_plural': 'cok engin',
};

const enUS = {
  engin: 'english engin',
  '{{count}} engin_0': 'no engins',
  '{{count}} engin_1': 'only one engin',
  '{{count}} engin_2': 'two engins',
  '{{count}} engin_3': '{{count}} engins',
  '{{count}} engin_4': '{{count}} engins',
  '{{count}} engin_5': '{{count}} engins',
  '{{count}} engin_plural': 'a lot of engins',
};

beforeAll(() => {
  expect(i18n.getLocale()).toEqual('');
  i18n.init({
    supportedLocales,
    locale: 'tr-TR',
    defaultLocale: 'tr-TR',
    resourceMap: {
      'tr-TR': trTR,
      'en-US': enUS,
    },
  });
});

it('should fail to initialize after first time, without force flag', () => {
  // @ts-ignore
  global.document.documentElement = {};
  localStorage.setItem('locale', 'tr-TR');
  expect(
    i18n.init({
      force: true,
      detect: true,
      supportedLocales,
      locale: 'tr-TR',
      defaultLocale: 'tr-TR',
    })
  );
  // @ts-ignore
  global.document = undefined;
  expect(
    i18n.init({
      force: true,
      remember: false,
      detect: true,
      supportedLocales,
      locale: 'tr-TR',
      defaultLocale: 'tr-TR',
    })
  );

  expect(() =>
    i18n.init({
      supportedLocales,
      locale: 'tr-TR',
      defaultLocale: 'tr-TR',
    })
  ).toThrow('@js-pack/i18n is already initialized.');
});

it('should initialize correctly with tr-TR', () => {
  expect(i18n.getLocale()).toEqual('tr-TR');
  expect(i18n.getSupportedLocales()).toEqual(supportedLocales);
});

it('should translate correctly tr-TR', () => {
  expect(i18n.t('engin')).toEqual('engin');
  expect(i18n.t('{{count}} engin', { count: 0 })).toEqual('hic engin');
  expect(i18n.t('{{count}} engin', { count: 1 })).toEqual('tek engin');
  expect(i18n.t('{{count}} engin', { count: 2 })).toEqual('iki engin');
  expect(i18n.t('{{count}} engin', { count: 3 })).toEqual('3 engin');
  expect(i18n.t('{{count}} engin', { count: 4 })).toEqual('4 engin');
  expect(i18n.t('{{count}} engin', { count: 5 })).toEqual('5 engin');
  expect(i18n.t('{{count}} engin', { count: 6 })).toEqual('cok engin');
  expect(i18n.t('{{count}} engin', { count: 100 })).toEqual('cok engin');
});

it('should update locale correctly to en-US', () => {
  i18n.setLocale('en-US');
  expect(i18n.getLocale()).toEqual('en-US');
});

it('should translate correctly en-US', () => {
  expect(i18n.t('engin')).toEqual('english engin');
  expect(i18n.t('{{count}} engin', { count: 0 })).toEqual('no engins');
  expect(i18n.t('{{count}} engin', { count: 1 })).toEqual('only one engin');
  expect(i18n.t('{{count}} engin', { count: 2 })).toEqual('two engins');
  expect(i18n.t('{{count}} engin', { count: 3 })).toEqual('3 engins');
  expect(i18n.t('{{count}} engin', { count: 4 })).toEqual('4 engins');
  expect(i18n.t('{{count}} engin', { count: 5 })).toEqual('5 engins');
  expect(i18n.t('{{count}} engin', { count: 6 })).toEqual('a lot of engins');
  expect(i18n.t('{{count}} engin', { count: 100 })).toEqual('a lot of engins');
});

it('should lazyly set resources', () => {
  // setResource override existing one
  i18n.setResource('en-US', { engin: 'english engin 2' });
  expect(i18n.t('engin')).toEqual('english engin 2');
  expect(i18n.t('{{count}} engin', { count: 1 })).not.toEqual('only one engin');
});

it('should set initial resources', () => {
  // setResource override existing one
  i18n.setResource('en-US', enUS);
  expect(i18n.t('engin')).not.toEqual('english engin 2');
  expect(i18n.t('{{count}} engin', { count: 1 })).toEqual('only one engin');
});

it('should lazyly extend resources', () => {
  // extendResource extends existing one
  i18n.extendResource('en-US', { engin: 'english engin 2' });
  expect(i18n.t('engin')).toEqual('english engin 2');
  expect(i18n.t('{{count}} engin', { count: 1 })).toEqual('only one engin');
});

it('should translate based on context', () => {
  i18n.extendResource('en-US', {
    arkadaş: 'friend',
    arkadaş_erkek: 'boyfriend',
    arkadaş_kız: 'girlfriend',
  });

  expect(i18n.t('arkadaş')).toEqual('friend');
  expect(i18n.t('arkadaş', { context: 'erkek' })).toEqual('boyfriend');
  expect(i18n.t('arkadaş', { context: 'kız' })).toEqual('girlfriend');
  expect(i18n.ct('kız', 'arkadaş')).toEqual('girlfriend');
});

it('should translate based on combination of context and plural', () => {
  i18n.extendResource('en-US', {
    '{{count}} arkadaş {{game}} oynamışlar_erkek':
      '{{count}} boyfriends played {{game}}',
    '{{count}} arkadaş_erkek_0': 'no boyfriends',
    '{{count}} arkadaş_erkek_1': '{{count}} boyfriend',
    '{{count}} arkadaş_erkek_plural': '{{count}} boyfriends',
  });

  expect(i18n.t('{{count}} arkadaş', { context: 'erkek', count: 0 })).toEqual(
    'no boyfriends'
  );
  expect(i18n.t('{{count}} arkadaş', { context: 'erkek', count: 1 })).toEqual(
    '1 boyfriend'
  );
  expect(i18n.t('{{count}} arkadaş', { context: 'erkek', count: 6 })).toEqual(
    '6 boyfriends'
  );
  expect(
    i18n.ct('erkek', '{{count}} arkadaş {{game}} oynamışlar', {
      count: 4,
      game: 'football',
    })
  ).toEqual('4 boyfriends played football');
});

it('should replace variable in text', () => {
  i18n.extendResource('en-US', {
    'hoş geldin {{user}}, {{mins}} dakikadır çevrimiçisin':
      'welcome {{user}}, you have been online for {{mins}} minutes',
  });

  expect(
    i18n.t('hoş geldin {{user}}, {{mins}} dakikadır çevrimiçisin', {
      user: 'Engin',
      mins: 12,
    })
  ).toEqual('welcome Engin, you have been online for 12 minutes');
});

it('should fallback to used key', () => {
  i18n.setLocale('no-LANG');

  expect(i18n.t('3 tas has hoşaf')).toEqual('3 tas has hoşaf');
});
