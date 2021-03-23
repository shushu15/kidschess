import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import i18n from '@/plugins/i18n';
import store from './store/';
//import ShareNetwork from '@/lib/vendor/share/vue-social-sharing.js';
 import './registerServiceWorker';
new Vue({
  el: '#app',
  vuetify,
  store,
  i18n, 
  //ShareNetwork,
  render: h => h(App)
});
