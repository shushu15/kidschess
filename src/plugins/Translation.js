// import axios from 'axios';

// import i18n from '@/plugins/i18n';

const SUPPORTED_LANGUAGES = {'en':['us'], 'ru':[], 'es':[], 'pt':['br']};
const DEFAULT_LANGUAGE = 'en';

export const Trans = { 
  get defaultLanguage() {
    return DEFAULT_LANGUAGE;
  },
  get supportedLanguages() {
    return SUPPORTED_LANGUAGES;
  },
  /* get currentLanguage() {
    return i18n.locale;
  },
  set currentLanguage(lang) {
    i18n.locale = lang;
  }, */
  /**
   * Gets the first supported language that matches the user's
   * @return {String}
   */
  getUserSupportedLang() {
    const userPreferredLang = Trans.getUserLang();

    // Check if user preferred browser lang is supported
    if (Trans.isLangSupported(userPreferredLang.lang)) {
      return userPreferredLang.lang;
    }
    // Check if user preferred lang without the ISO is supported
    if (Trans.isLangSupported(userPreferredLang.langNoISO)) {
      return userPreferredLang.langNoISO;
    }
    return Trans.defaultLanguage;
  },
  /**
   * Returns the users preferred language
   */
  getUserLang() {
    const lang = window.navigator.language || window.navigator.userLanguage || Trans.defaultLanguage;
    return {
      lang,
      langNoISO: lang.includes('-')? lang.split('-')[0] : lang.includes('_')? lang.split('_')[0]: lang,
    };
  },
  /**
   * Returns the users preferred locale
   */
   getUserLocale() {
    const langISO = window.navigator.language || window.navigator.userLanguage || Trans.defaultLanguage;
    let [lang, locale] = ((langISO.replace('-', '_')).toLowerCase()).split('_');
    return {
      lang, locale,
    }
  },
  getUserSupportedLocale(ln) {
    const userPreferredLocale = Trans.getUserLocale();
    const lang = ln || Trans.getUserSupportedLang();
    let locale = lang
    if (lang === userPreferredLocale.lang && Object.prototype.hasOwnProperty.call(Trans.supportedLanguages, lang)) {
      if (Trans.supportedLanguages[lang].includes(userPreferredLocale.locale)) // found supported locale
        locale = userPreferredLocale.locale;
    }
    return locale;
  },
  /**
   * Sets the language to various services (axios, the html tag etc)
   * @param {String} lang
   * @return {String} lang
   */
  /*
  setI18nLanguageInServices (lang) {
    Trans.currentLanguage = lang;
    axios.defaults.headers.common['Accept-Language'] = lang;
    document.querySelector('html').setAttribute('lang', lang);
    return lang;
  },
  */

  /**
   * Loads new translation messages and changes the language when finished
   * @param lang
   * @return {Promise<any>}
   */
  /*
  changeLanguage(lang) {
    if (i18n.locale !== lang) {
      i18n.locale = lang;
    }
  }, */
  /*
  changeLanguage (lang) {
    if (!Trans.isLangSupported(lang)) return Promise.reject(new Error('Language not supported'));
    if (i18n.locale === lang) return Promise.resolve(lang); // has been loaded prior
    return Trans.loadLanguageFile(lang).then(msgs => {
      i18n.setLocaleMessage(lang, msgs.default || msgs);
      return Trans.setI18nLanguageInServices(lang);
    });
  },
  */
  /**
   * Async loads a translation file
   * @param lang
   * @return {Promise<*>|*}
   */
  // loadLanguageFile (lang) {
  //   return import(/* webpackChunkName: "lang-[request]" */ `@/locales/${lang}.json`);
  // },

  /**
   * Checks if a lang is supported
   * @param {String} lang
   * @return {boolean}
   */
  isLangSupported(lang) {
    // return Trans.supportedLanguages.includes(lang);
    // Trans.supportedLanguages.hasOwnProperty(lang) 
    return Object.prototype.hasOwnProperty.call(Trans.supportedLanguages, lang);
  },
  /**
   * Checks if the route's param is supported, if not, redirects to the first supported one.
   * @param {Route} to
   * @param {Route} from
   * @param {Function} next
   * @return {*}
   */
  /*
  routeMiddleware (to, from, next) {
    // Load async message files here
    const lang = to.params.lang;
    if (!Trans.isLangSupported(lang)) return next(Trans.getUserSupportedLang());
    return Trans.changeLanguage(lang).then(() => next());
  }, */
  /**
   * Returns a new route object that has the current language already defined
   * To be used on pages and components, outside of the main \ route, like on Headers and Footers.
   * @example <router-link :to="$i18nRoute({ name: 'someRoute'})">Click Me </router-link>
   * @param {Object} to - route object to construct
   */
  /*
  i18nRoute (to) {
    return {
      ...to,
      params: { lang: this.currentLanguage, ...to.params }
    }
  } */
};

// export default { Trans };
