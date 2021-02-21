export default {
  getCurrentTask(state) {
    return state.currentTask;
  },
  getTurn(state) {
    return state.turn;
  },
  moveAI(state) {
    return state.moveAI;
  },
  getEngineDeep(state) {
    console.log(`state.engineLevel :${state.engineLevel} state.engineDeep: ${state.engineDeep[state.engineLevel]} `); // eslint-disable-line no-console

    return state.engineDeep[state.engineLevel];
  },
  flipToWhite(state) {
    return (state.currentTask && state.currentTask.orientation === 'black') && !state.gameActive;
  },
  flipToBlack(state) {
    return (state.currentTask && state.currentTask.orientation === 'white') && !state.gameActive;
  },
  showClock: (state, getters) => (side) => {
    return getters.getTurn === side && state.currentTask.orientation === 'white' ||
    getters.getTurn === op(side) && state.currentTask.orientation === 'black';
  },
  showBtnStart(state, getters) {
    return !state.gameActive && (getters.getTurn === 'b' && state.currentTask.orientation === 'white' ||
    getters.getTurn === 'w' && state.currentTask.orientation === 'black');
  }

};

function op(side) {
  return side === 'w'? 'b': side === 'b'? 'w': side;
}
