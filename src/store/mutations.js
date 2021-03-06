/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint prefer-const: "off" */
import * as KidsConst from '@/lib/const.js';


export default {

  hideTitleScreen(state) {
    state.isTitleShowing = false;
  },
  // trick to load main screen in the hidden mode
  readyScreen(state) {
    state.isScreenReady = true;
  },
  
  switchDemo(state, {value}) {
    state.isDemo = value;
  },
  switchHelp(state, {value}) {
    state.showHelp = value;
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
  addMove(state, payload) {
    if (payload !== undefined && payload.move !== undefined) { 
      state.history.moves.push(payload.move);
    } else {
      state.history.moves.splice(0); // reactivity required, not simple length = 0
    }
  },
  // here we do not use 'fen' positions - will change to the counter
  actBackward(state) {
    if (state.history.moves.length > 0)
      state.history.moves.pop();
  },
  snackbarMessage(state, {value, type}) {
    if (typeof value === "boolean" && !value) {
      state.snackbar.message = '';
      state.snackbar.type = KidsConst.TYPE_NONE;
    } else  {
      state.snackbar.message = value;
      state.snackbar.type = (type !== undefined)? type: KidsConst.TYPE_NONE;  
    }
  },
  setLongThinking(state, {value}) {
    state.longThinking = value;
  },
  storeTimer(state, payload) {
    if (payload !== undefined && payload.timerID !== undefined) { 
      state.timerID = payload.timerID;
    } else {
      state.timerID = undefined; 
    }
  },
  backMoves(state, { value }) {
    state.modeNoBackMoves = (value === undefined) ? !state.modeNoBackMoves : value;
  },
  twoPlayers(state, { value }) {
    state.modeTwoPlayers = (value === undefined) ? !state.modeTwoPlayers : value;
  },
  modeSpeech(state, payload) {
    if (payload !== undefined && payload.value !== undefined) { 
      state.modeSpeech = payload.value;
    } else {
      state.modeSpeech = !state.modeSpeech; 
    }
  },
  /*
  flipPieces(state, { value }) {
    state.modeFlipPieces = value === undefined ? !state.modeFlipPieces : value;
  }, */
  forcedBtnStart(state, {value}) {
    state.forcedBtnStart = value;
  },
  speechSupported(state, {value}) {
    state.speechSupported = value;
    console.log(`speechSupported commit to :${value}`); // eslint-disable-line no-console
  },


};
