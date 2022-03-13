type ResourceByLangType = { [key: string]: string };
type ResourceMapType = { [key: string]: ResourceByLangType };
type OptionsType = {
  force?: boolean;
  locale: string;
  defaultLocale: string;
  remember?: boolean;
  detect?: boolean;
  supportedLocales: string[];
  resourceMap?: ResourceMapType;
};
type TranslateOptions = {
  [key: string]: string | number | undefined;
  count?: number;
  context?: string;
};

let options: OptionsType & {
  initialized: boolean;
  resourceMap: ResourceMapType;
} = {
  force: false,
  initialized: false,
  locale: '',
  defaultLocale: '',
  remember: true,
  detect: false,
  supportedLocales: [],
  resourceMap: {},
};

const setLocale = (locale: string) => {
  if (options.remember && localStorage.getItem('locale') !== locale) {
    localStorage.setItem('locale', locale);
  }
  if (options.locale !== locale) {
    options.locale = locale;
  }
  if (document?.documentElement) {
    document.documentElement.lang = locale;
  }
};

const detectLocale = () => {
  if (options.detect) {
    setLocale(navigator.language);
  } else {
    setLocale(options.defaultLocale);
  }
};

const init = ({ supportedLocales, force, ...rest }: OptionsType) => {
  if (force || !options.initialized) {
    if (Array.isArray(supportedLocales) && supportedLocales.length > 0) {
      options.supportedLocales = supportedLocales;
    }
    if (rest) {
      options = { ...options, ...rest };
    }
    if (options.remember) {
      const storedLocale = localStorage.getItem('locale');
      if (storedLocale) {
        setLocale(storedLocale);
      } else {
        detectLocale();
      }
    } else {
      detectLocale();
    }
    options.initialized = true;
  } else {
    throw new Error('@js-pack/i18n is already initialized.');
  }
};

const getLocale = () => options.locale || options.defaultLocale;
const getSupportedLocales = () => options.supportedLocales;

const extendResource = (locale: string, resource: ResourceByLangType) => {
  options.resourceMap[locale] = { ...options.resourceMap[locale], ...resource };
};
const setResource = (locale: string, resource: ResourceByLangType) => {
  options.resourceMap[locale] = resource;
};

const t = (
  text: string,
  { count = -1, context, ...rest }: TranslateOptions = {}
) => {
  const resource = options.resourceMap[getLocale()];
  const textKey = context ? `${text}_${context}` : text;
  let translatedText: string =
    resource?.[`${textKey}_${count}`] ||
    resource?.[count > 1 ? `${textKey}_plural` : textKey] ||
    resource?.[`${textKey}`] ||
    text;

  translatedText = translatedText.replace(
    new RegExp('{{count}}', 'g'),
    count.toString()
  );

  Object.keys(rest).forEach((key) => {
    const value = rest[key];
    translatedText = translatedText.replace(
      new RegExp(`{{${key}}}`, 'g'),
      `${value}`
    );
  });
  return translatedText;
};

export {
  extendResource,
  getLocale,
  getSupportedLocales,
  init,
  setLocale,
  setResource,
  t,
};
