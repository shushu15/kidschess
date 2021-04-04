import i18n from '@/plugins/i18n'; 
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
  // returns adapted depth, on difficult positions it reduce depth
  getEngineDeep(state, getters) {
    let depth  = state.engineDeep[state.engineLevel].depth;
    if (getters.getCurrentTask.difficulty !== undefined) 
      depth -= getters.getCurrentTask.difficulty * state.engineDeep[state.engineLevel].reduce;
    console.log(`state.engineLevel :${state.engineLevel} state.engineDeep: ${depth} `); // eslint-disable-line no-console

    return depth;
  },
  // returns adapted depth, on difficult positions it reduce depth
  getEngineDeepDynamic(state, getters) {
    let depth  = state.engineDeep[state.engineLevel].depth;
    if (getters.getCurrentTask.difficulty !== undefined) 
      depth -= getters.getCurrentTask.difficulty * state.engineDeep[state.engineLevel].reduce;
    if (getters.getCurrentTask.dynamic !== undefined) 
      depth -= getters.getCurrentTask.dynamic * state.engineDeep[state.engineLevel].reduce;
    console.log(`state.engineLevel :${state.engineLevel} state.engineDeep: ${depth} `); // eslint-disable-line no-console

    return depth;
  },
  getEngineMistake(state) {
    console.log(`state.engineLevel :${state.engineLevel} state.engineMistake: ${state.engineDeep[state.engineLevel].mistake} `); // eslint-disable-line no-console
    return state.engineDeep[state.engineLevel].mistake;
  },
  getLevelHint(state) {
    return i18n.t(state.engineDeep[state.engineLevel].hint);
  },
  flipToWhite(state, getters) {
    return (state.currentTask && getters.getOrientation === KidsConst.BLACK) && !state.gameActive;
  },
  flipToBlack(state, getters) {
    return (state.currentTask && getters.getOrientation === KidsConst.WHITE) && !state.gameActive;
  },
  getOrientation(state) {
    return state.currentTask.orientation;
  },
  
  showClock: (state, getters) => (side) => {
    return getters.getTurn === side && getters.getOrientation === KidsConst.WHITE ||
    getters.getTurn === op(side) && getters.getOrientation === KidsConst.BLACK;
  }, 
  showBtnStart(state, getters)  {
    return getters.showBtnStartGen && (!state.gameActive || state.forcedBtnStart);
  },
  showBtnStartGen(state, getters) {
    return !getters.twoPlayers && (getters.getTurn === 'b' && getters.getOrientation === KidsConst.WHITE ||
    getters.getTurn === 'w' && getters.getOrientation === KidsConst.BLACK);
  },
  reloadAllowed(state) {
    // return state.canReload;
    return state.gameActive;
  },
  gameActive(state) {
    return state.gameActive;
  },
  // side here HUMAN of ROBOT. Robot is always on the NORTH
  isMoveOf: (state, getters) => (side) => {
    let forHuman = getters.getTurn === 'w' && getters.getOrientation === KidsConst.WHITE ||
    getters.getTurn === 'b' && getters.getOrientation === KidsConst.BLACK;
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
  cartoonByID: (state) => (id, side) => {
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
          cartoonFound = childFound.cartoon[side] !== undefined? childFound.cartoon[side] : childFound.cartoon;
        else if(childFound.avatar !== undefined)  // check then avatar field inside task
          cartoonFound = childFound.avatar;
        else if (state.tasks[i].cartoon !== undefined) // then specific cartoon field fo group
          cartoonFound = state.tasks[i].cartoon[side] != undefined? state.tasks[i].cartoon[side] : state.tasks[i].cartoon;
        else // then use avatar of the group
          cartoonFound = state.tasks[i].avatar;
        return cartoonFound;    
      }
    }
    // standard game
    cartoonFound = (state.standard.id === id)? (state.standard.cartoon !== undefined? 
        state.standard.cartoon[side]: state.standard.avatar) : ""; //undefined;
    return cartoonFound;
  },
  currentParent (state) {
    let id = state.currentTask.id;
    for (let i=0; i < state.tasks.length; i++) {
      // jshint -W083
      if (state.tasks[i].data.find((child) => child.id === id) !== undefined) {
        return state.tasks[i];
      }
      // jshint +W083
    }
    return undefined;
  },

  canBackward(state, getters) {
    return  !state.modeNoBackMoves && 
        ((getters.isMoveOf(KidsConst.HUMAN) && state.history.moves.length > 1) ||
        (getters.twoPlayers && state.history.moves.length > 0)); 
    
  },
  /******
   * Returns last part of moves to show
   */
  textLastMove(state) {
    if (state.history.moves.length > 0) {
      let mn = Math.floor((state.history.moves.length-1) / 2) + 1;
      return `${mn}. ${(state.history.moves.length % 2 === 0)? '...': ''}${state.history.moves[state.history.moves.length-1]}`;
    }
    return '';
 
  },
  movesNumberOut: (state) => (maxmove, bForBlack) => {
    return Math.floor((state.history.moves.length + (bForBlack? 0: 1)) / 2) >= maxmove;
  },
  /**
   * Return rules for the current task, or if not specified - from the parent
   * @param {*} state 
   * @param {*} getters 
   * @returns int bitwise 
   */
  getTaskRules(state, getters) {
    // jshint -W080
    let childFound = undefined;
    // jshint +W080
    if (getters.getCurrentTask.rules !== undefined)
      return getters.getCurrentTask.rules;
    else { // TODO: read parent rules
      let id = getters.getCurrentTask.id;
      for (let i=0; i < state.tasks.length && childFound === undefined; i++) {
        // jshint -W083
        childFound = state.tasks[i].data.find((child) => child.id === id);
        // jshint +W083
        if (childFound !== undefined)
          return (state.tasks[i].rules !== undefined)? state.tasks[i].rules: KidsConst.RULES_DEFAULT;
      }
      return KidsConst.RULES_DEFAULT;
    }
  },
  longThinking(state) {
    return state.longThinking;
  },
  twoPlayers(state) {
    return state.modeTwoPlayers;
  }


};

function op(side) {
  return side === 'w'? 'b': side === 'b'? 'w': side;
}

