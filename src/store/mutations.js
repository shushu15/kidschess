/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint prefer-const: "off" */
import * as KidsConst from '@/lib/const.js';


export default {

  hideTitleScreen(state) {
    state.isTitleShowing = false;
  },
  toggleDrawer(state, { show }) {
    state.showDrawer = show === undefined ? !state.showDrawer : show;
  },
  setChild(state, {child}) {
   // if (Object.keys(state.currentTask).length !== 0 && state.currentTask.id === child.id ) // the same need force to redraw
   //   state.currentTask.fen += ' ';
   // else
      state.currentTask = child;
      state.finishedGame = false;
  },
  setTurn(state, {turn}) {
    state.turn = turn;
  },
  updateEngineLevel(state, {value}) {
    state.engineLevel = value;
  },
  setWorkerAI(state, { worker }) {
    state.webWorkerAI = worker;
  },
  bestMove(state, {move}) {
    state.moveAI = move;
  },
  flipBoard(state) {
    if (state.currentTask) {
      state.currentTask.orientation =  (state.currentTask.orientation===KidsConst.WHITE? KidsConst.BLACK : KidsConst.WHITE);  
      state.finishedGame = false; 
    }
  },

  setGameActive(state, {value}) {
    state.gameActive = value;
  },
  /* canReload(state, {value}) {
    state.canReload = value;
  } */
  setLastPromotion(state, {value}) {
    state.lastPromotion = value;
  },
  finishedGame(state, {value}) {
    state.finishedGame = value;
  },
  flashAnimal(state, {value}) {
    state.flashAnimal = value;
  },
  setHistoryFen(state, payload) {
    if (payload !== undefined && payload.fen !== undefined) { 
      state.history.fen.push(payload.fen);
    } else {
      state.history.fen.length = 0;
    }
  },
  // here we do not use 'fen' positions - will change to the counter
  actBackward(state) {
    if (state.history.fen.length > 1)
      state.history.fen.pop();
  },
  snackbarMessage(state, {value}) {
    if (typeof value === "boolean" && !value) 
      state.snackbarMessage = '';
    else  
      state.snackbarMessage = value;
  }
};
