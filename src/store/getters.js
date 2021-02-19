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
};
