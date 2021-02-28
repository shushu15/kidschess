import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';


Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const state = {
  version: '0.1.1c',
  HUMAN: 1,
  ROBOT: 2,
  isTitleShowing: true,
  showDrawer: false,
  currentTask: {}, 
  turn: '',
  webWorkerAI: undefined, 
  moveAI: '', 
  engineDeep: [1,1,5,10],
  engineLevel: 3,
  gameActive: false,
  // canReload: false
  lastPromotion: '',   // last cell promoted
  finishedGame: false,
  flashAnimal: false
};

export default new Vuex.Store({
  strict: debug,
  state,
  getters,
  mutations,
  actions,
});
