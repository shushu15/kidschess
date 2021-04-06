import Vue from 'vue';
// import Vuetify from 'vuetify/lib/framework';
// for treeshaking docs insist on import from vuetify/lib though result is the same as import from vuetify/lib/framework
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdiSvg',
      },
});
