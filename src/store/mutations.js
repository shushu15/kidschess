/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint prefer-const: "off" */


export default {

  hideTitleScreen(state) {
    state.isTitleShowing = false;
  },
  toggleDrawer(state, { show }) {
    state.showDrawer = show === undefined ? !state.showDrawer : show;
  },
  setChild(state, {child}) {
   // if (Object.keys(state.currentTask).length !== 0 && state.currentTask.service.id === child.service.id ) // the same need force to redraw
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
      state.currentTask.orientation =  (state.currentTask.orientation==='white'? 'black' : 'white');  
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
  }
};
