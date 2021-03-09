import * as KidsConst from '@/lib/const.js';

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
    console.log(`state.engineLevel :${state.engineLevel} state.engineDeep: ${state.engineDeep[state.engineLevel].depth} `); // eslint-disable-line no-console

    return state.engineDeep[state.engineLevel].depth;
  },
  getEngineMistake(state) {
    console.log(`state.engineLevel :${state.engineLevel} state.engineMistake: ${state.engineDeep[state.engineLevel].mistake} `); // eslint-disable-line no-console
    return state.engineDeep[state.engineLevel].mistake;
  },
  getLevelHint(state) {
    return state.engineDeep[state.engineLevel].hint;
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
  },
  reloadAllowed(state) {
    // return state.canReload;
    return state.gameActive;
  },
  // side here HUMAN of ROBOT. Robot is always on the NORTH
  isMoveOf: (state, getters) => (side) => {
    let forHuman = getters.getTurn === 'w' && state.currentTask.orientation === 'white' ||
    getters.getTurn === 'b' && state.currentTask.orientation === 'black';
    return side === KidsConst.HUMAN? forHuman: !forHuman;
  },
  finishedGame(state) {
    return state.finishedGame;
  },
  flashAnimal(state) {
    return state.flashAnimal;
  },
  tasksData(state) {
    return state.tasks;
  },
  standardData(state) {
    return state.standard;
  },
  childByID: (state) => (id) => {
    // jshint -W080
    let childFound = undefined; 
    // jshint +W080
    for (let i=0; i < state.tasks.length && childFound === undefined; i++) {
      // jshint -W083
      childFound = state.tasks[i].data.find((child) => child.id === id);
      // jshint +W083
    }
    if (childFound === undefined ) {
      childFound = (state.standard.id === id)? state.standard: undefined;
    }
    return childFound;
  },
  cartoonByID: (state) => (id) => {
    // jshint -W080
    let childFound = undefined;
    let cartoonFound = undefined;
    // jshint +W080
    for (let i=0; i < state.tasks.length && childFound === undefined; i++) {
      // jshint -W083
      childFound = state.tasks[i].data.find((child) => child.id === id);
      // jshint +W083
      if (childFound !== undefined) {
        if(childFound.cartoon !== undefined)  // check first cartoon field inside task
          cartoonFound = childFound.cartoon;
        else if(childFound.avatar !== undefined)  // check then avatar field inside task
          cartoonFound = childFound.avatar;
        else if (state.tasks[i].cartoon !== undefined) // then specific cartoon field fo group
          cartoonFound = state.tasks[i].cartoon;
        else // then use avatar of the group
          cartoonFound = state.tasks[i].avatar;
        return cartoonFound;    
      }
    }
    // standard game
    cartoonFound = (state.standard.id === id)? (state.standard.cartoon !== undefined? state.standard.cartoon: state.standard.avatar) : ""; //undefined;
    return cartoonFound;
  },
  canBackward(state, getters) {
    return getters.isMoveOf(KidsConst.HUMAN) && state.history.fen.length > 1;
  },
  getTaskRules(state, getters) {
    if (getters.getCurrentTask().rules !== undefined)
      return getters.getCurrentTask().rules;
    else // TODO: read parent rules
      return 'material_win';


  }


};

function op(side) {
  return side === 'w'? 'b': side === 'b'? 'w': side;
}
