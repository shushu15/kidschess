import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';


Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const state = {
  version: '1.0.a1',
  isTitleShowing: true,
  showDrawer: false,
  currentTask: {}, 
  turn: '',
  webWorkerAI: undefined, 
  moveAI: '',    
};

export default new Vuex.Store({
  strict: debug,
  state,
  getters,
  mutations,
  actions,
});
