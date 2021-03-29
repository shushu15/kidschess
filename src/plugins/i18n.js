import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { Trans } from './Translation';

//TODO load messages asynch https://kazupon.github.io/vue-i18n/guide/lazy-loading.html

Vue.use(VueI18n);

function loadLocaleMessages() {
  const locales = require.context('@/locales', false, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

export default new VueI18n({
  locale: Trans.getUserSupportedLang(),
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
});
