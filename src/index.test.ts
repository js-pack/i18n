import * as i18n from './index';

it('should initialize', () => {
  const supportedLocales = ['tr-TR', 'en-US'];
  i18n.init({
    supportedLocales,
    locale: 'tr-TR',
    defaultLocale: 'tr-TR',
  });

  expect(i18n.getLocale()).toEqual('tr-TR');
  expect(i18n.getSupportedLocales()).toEqual(supportedLocales);
});
