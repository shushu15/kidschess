import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import i18n from '@/plugins/i18n'; 
import store from './store/'; 
new Vue({
  el: '#app',
  vuetify,
  store,
  i18n,   
  render: h => h(App)
});
