//const DEFAULT_DELAY = 250;
//const DELAY_TIPS = 3000;

export default {
  /**
   * Worker methods
   */
  workerRequest({state, getters}, {message}) {
    state.webWorkerAI.postMessage(`position fen ${message}`);
    // state.webWorkerAI.postMessage('setoption name nokings value true');
    state.webWorkerAI.postMessage(`go depth ${getters.getEngineDeep}`);
    // console.log(`dispatch workerRequest:${message} level ${getters.getEngineDeep}`); // eslint-disable-line no-console

  },
  workerReply( {commit}, { message }) { // received discard from web worker
      // console.log(`dispatch workerReply :${message}`); // eslint-disable-line no-console
      if (message.startsWith('bestmove')) {
        let arrTokens = message.trim().split(' ');
        if (arrTokens.length > 1) {
          commit('bestMove', { move: arrTokens[1] });
        }
        else {
          commit('finishedGame', {value: true});
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
  }

  /*
  requestDiscard({ state, getters, rootState }, { side }) {
    const theHand = state.game.piles[side];
    if (theHand.getSize() === 6) {
      rootState.webWorker.sendQuery('discardToCrib', side, theHand.toString(), side === getters.getDealer);
    }
  },
  requestNextMove({ state, getters, rootState }, { side }) {
    // console.log(`requestNextMove side:${side}`); // eslint-disable-line no-console
    // observer, sTurn, sState, sDealer, sLastTurn, sUpcard, sCribSouth, sCribNorth, sSOUTH, sNORTH, sCENTER, sEAST, sWEST
    rootState.webWorker.sendQuery('nextMove', side, getters.getTurn, getters.getGameState, getters.getDealer, getters.getLastTurn,
      state.game.piles.PILE.peek().toString(), state.game.gameData.CRIB.SOUTH.toString(), state.game.gameData.CRIB.NORTH.toString(),
      state.game.piles.SOUTH.toString(), state.game.piles.NORTH.toString(), state.game.piles.CENTER.toString(),
      state.game.piles.EAST.toString(), state.game.piles.WEST.toString());
  },
*/
  /**
   * Reply from Web Worker received
   * @param {*} param0
   * @param {*} cardsarr - arra y of string representation of cards
   */
  /*
  workerCardsToMove({ dispatch, commit }, { side, cardsarr }) { // received discard from web worker
    let cc;
    let ar = [];
    if (cardsarr) {
      ar = cardsarr.split(',');
      ar.forEach((scard, ind) => {
        cc = new Card(scard);
        // cc.fromString(scard);
        ar[ind] = cc;
      });
    }
    if (side === NORTH) { // move card
      dispatch('opponentMove', { cardsarr: ar });
    } else if (side === SOUTH) { // give tips
      commit('saveShowCombinations', { side: SOUTH, showObj: ar });
      commit('setBottomMessage', { process: { visible: false } }, { root: true }); // we pass key message
      dispatch('tipDispatcher', {});
    }
  }, */

};
