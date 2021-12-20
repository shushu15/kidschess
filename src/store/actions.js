// import * as Speech from '@/lib/speech.js';
import * as KidsConst from '@/lib/const.js';
import * as DB from '@/lib/db.js';


// import i18n from '@/plugins/i18n'; 

export default {
  /**
   * Worker methods
   */
  workerSendPosition({state, getters, commit}, {position, moves, dynamic}) {
    let deep = dynamic? getters.getEngineDeepDynamic : getters.getEngineDeep;
    let command = (moves && moves.length > 0)? `position fen ${position} moves ${moves.join(' ')}` : `position fen ${position}`;
    state.webWorkerAI.postMessage(command);
    state.webWorkerAI.postMessage(`go depth ${deep} movetime ${KidsConst.MOVETIME}`);
    if (deep > KidsConst.THINKING_LEVEL) {
      let timerID = setTimeout(() => { 
          commit('setLongThinking', {value: true}); }, KidsConst.THINKING_DELAY); 
      commit('storeTimer', {timerID});   
    }
    // console.log(`dispatch workerRequest:${command} level ${getters.getEngineDeep}`); // eslint-disable-line no-console

  },
  workerSendNewGame({state, dispatch}) {
    //console.log('dispatch workerSendNewGame'); // eslint-disable-line no-console
    state.webWorkerAI.postMessage('ucinewgame');
    dispatch('workerSendMistakeLevel');
//    state.webWorkerAI.postMessage(`debug on`);

  },
  workerSendMistakeLevel({state, getters}) {
    if (state.webWorkerAI) {
      //let mistake_lvl = getters.getEngineMistake;
      //if (getters.getCurrentTask.mistake_mult)
      //  mistake_lvl *= getters.getCurrentTask.mistake_mult;
      state.webWorkerAI.postMessage(`setoption name mistakes value ${getters.getEngineMistake}`);
      // console.log(`dispatch workerSendMistakeLevel ${mistake_lvl}`); // eslint-disable-line no-console
    }
  },
  workerReply( {state, commit}, { message }) { // received discard from web worker
      // console.log(`dispatch workerReply :${message}`); // eslint-disable-line no-console
      if (message.startsWith('bestmove')) {
        // stop timer first
        if (state.timerID !== undefined) { 
          clearTimeout(state.timerID);    
          commit('storeTimer'); // cler timerID
          commit('setLongThinking', {value: false});
        }   
        let arrTokens = message.trim().split(' ');
        if (arrTokens.length > 1) {
          commit('bestMove', { move: arrTokens[1] });
        }
        else {
          // TODO: check if this is called at all after adding checkRules()
          commit('finishedGame', {value: true});
          // commit('snackbarMessage', {value: i18n.t('result.won')});
          // console.log(`dispatch workerReply nomove`); // eslint-disable-line no-console
        }
      }
  },
  flashAnimal( {state, commit} ) {
    setTimeout(() => { 
      if (!state.gameActive)
        commit('flashAnimal', {value: true}); }, 2000); 
    setTimeout(() => { 
        commit('flashAnimal', {value: false}); }, 4000); 
  },
  startDemo( {commit} ) {
    commit('switchDemo', {value: true}); 
    setTimeout(() => { 
        commit('switchDemo', {value: false}); }, 5000); 
  },
  showHelp({commit}) {
    commit('switchHelp', {value: true}); 
    setTimeout(() => { 
        commit('switchHelp', {value: false}); }, 5000); 
  },
  db_init({state, commit}) {
    if(!DB.getDB() && state.modeCollectStat) {
      DB.init().then((res) => {
        if (res === DB.DB_ERR || res === DB.DB_NOTFOUND) {
          commit('collectStat',  {value: false});
          console.log(`db_init db error ${res}`); // eslint-disable-line no-console
        } else { // build prizes cache
          DB.getP
        }
      });
    } else  console.log('db_init db already in use'); // eslint-disable-line no-console
  },

  db_SaveGame({state, commit}, {type}) {
    if(DB.getDB() && state.modeCollectStat) {
      commit('saveGameSign', {value: true, type}); // set sign, that game is save do not repeat saving
      switch (type) {
      case KidsConst.SAVED_START: 
        DB.startGame(state.currentTask.id).then((res) => {
          if (res === DB.DB_ERR || res === DB.DB_NOTFOUND) {
            commit('collectStat',  {value: false});
            console.log(`db_SaveGame start error ${res}`); // eslint-disable-line no-console
          }
        });
        break;
      case KidsConst.SAVED_FINISH: 
        DB.finishGame(state.currentTask.id).then((res) => {
          if (res === DB.DB_ERR || res === DB.DB_NOTFOUND) {
            commit('collectStat',  {value: false});
            console.log(`db_SaveGame finish error ${res}`); // eslint-disable-line no-console
          }
        });
        break;
      }
    }
  },

/*
  onLangChange({lang}) {
    Speech.preferredLanguage(lang);
    Speech.selectLanguage();
  }
*/
 
};
