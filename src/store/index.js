import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';


Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const state = {
  version: '0.1.1',
  isTitleShowing: true,
  showDrawer: false,
  currentTask: {}, 
  turn: '',
  webWorkerAI: undefined, 
  moveAI: '', 
  engineDeep: [1,5,9,12],
  engineLevel: 3,
};

export default new Vuex.Store({
  strict: debug,
  state,
  getters,
  mutations,
  actions,
});
