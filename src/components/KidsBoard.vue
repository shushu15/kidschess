
<script>
import {  mapGetters } from 'vuex'; 
import { chessboard }  from '@/components/vendor/chessboard/index.js';
//import * as Speech from '@/lib/speech.js';
import * as KidsConst from '@/lib/const.js';
import * as DB from '@/lib/db.js';
// import '@/lib/parse-transform.js';

// import { chessboard }  from 'vue-chessboard'
// import {aiMoveExport} from '@/lib/ai/js-chess-engine/js-chess-engine';
// import {aiMoveExport} from '@/lib/ai/js-chess-engine.mjs'

export default {
  name: 'KidsBoard',
  extends: chessboard,
  props: {
    fen: String,
    orientation: String,
    id: String,
    forced: Date,
    showThreats: Boolean,
  },
  methods: {
    initialMove() {
      this.launchMoveSequence();
      this.$store.commit('setTurn', { turn: this.game.turn() });
      this.$store.commit('addMove');  // no paraneters - clear history
      this.$store.commit('saveGameSign', {value: false}); // clear both start and finish
    },

    launchMoveSequence() {
      this.board.set({
          movable: { events: { after: this.userPlay()} },
      });
    }, 

    userPlay() {
      return (orig, dest) => {
        // console.log(`userPlay ${orig} ${dest}`);
        this.$store.commit('setGameActive', {value: true})
        this.dbOnGameStart();
        /*
        if (!this.$store.state.gameSaved.start && this.$store.state.modeCollectStat) {
          this.$store.dispatch('db_saveGame', {type: KidsConst.SAVED_START}).then((result) => {
            if (result === DB.DB_OK) {
                this.$store.dispatch('db_cacheGames').then((result) => {
                  if (typeof result == 'object') this.$store.commit('fillGamesCache', {value: result, getters: this.$store.getters });
                })
            }
          });
        } */
        if (this.isPromotion(orig, dest)) {
          this.promoteTo = this.onPromotion();
          // this.$store.commit('canReload', {value: true});  // can reload close to finish game
        }
        this.game.move({from: orig, to: dest, promotion: this.promoteTo}) // promote to queen for simplicity
        this.board.set({
          fen: this.game.fen()
        })
        this.calculatePromotions();
        this.$store.commit('addMove', {move: `${orig}${dest}`});
        this.$store.commit('setTurn', { turn: this.game.turn() });
        this.afterMove();
        if (this.twoPlayers) {
          let res = this.checkRules(this.toColor());  // check rules before AI move on its turn
          this.board.set({
            turnColor: this.toColor(),
            movable: {
              color: res? undefined: this.toColor(),
              dests: res? undefined: this.possibleMoves(),
              events: { after: res? undefined: this.userPlay()},
            },
          });
          /*
          if (res && !this.$store.state.gameSaved.finish && this.$store.state.modeCollectStat) {
            this.$store.dispatch('db_SaveGame', {type: KidsConst.SAVED_FINISH});
          } */
          if (res) 
            this.dbOnGameEnd();


          // this.flipFiguresCSS();
        }
        else  // AI player
          setTimeout(() => {this.aiNextMove();}, 100); // allow redraw
      }
    },
    aiNextMove() {
      this.$store.commit('setGameActive', {value: true})
      let res = this.checkRules(KidsConst.ROBOT);  // check rules before AI move on its turn
      // console.log(`aiNextMove res=${res}`);

      this.board.set({
        movable: {
          color: undefined, // disable moves
        }
      })
      if (res) {
        /* if (!this.$store.state.gameSaved.finish && this.$store.state.modeCollectStat) {
          this.$store.dispatch('db_SaveGame', {type: KidsConst.SAVED_FINISH});
        } */
        this.dbOnGameEnd();
        return; 
      }
      // for dynamic depth positions get fen first
      let dynamic = false;
      /* Temporarily switched off
      if (this.$store.getters.getCurrentTask.dynamic) {
        let fen = this.game.fen().split(' ')[0];
        if ((fen.match(/p/gi) || []).length == 0)// no pawns
          dynamic = true;
      }
      */

      // WORKER
      // either initial position + all moves (for 3times repetition prevent), or regular current fen
      if (this.$store.getters.getCurrentTask.movesAI)
        this.$store.dispatch('workerSendPosition', { position: this.$store.getters.getCurrentTask.fen, moves: this.$store.state.history.moves, dynamic}); 
      else  
        this.$store.dispatch('workerSendPosition', { position: this.game.fen(), dynamic }); 
    }, 
    /*
    flipFiguresCSS() {
      this.board.set({
        flipPieces: true
      }) 
    
          let elements = this.$el.querySelectorAll('cg-board piece');
          elements.forEach(element => {
            let t =  element.style.transform;
            let tt= t.parseTransform();
            if (tt.rotate) tt.rotate = undefined;
            else tt.rotate  = {a:"180",x:0,y:0};
            //element.style.transform = `${t} rotate(180deg)`
            element.style.transform = `${tt.toString()}`;
            console.log(`element ${t} -> ${tt.toString()}`);});
            

          // elements.forEach(element => {console.log(`element ${element.getAttribute("style")}`);});
          //let elements=this.$el.getElementsByTagName("piece");
          // elements.forEach(element => {console.log(`element ${element.contentDocument()}`);});
        // svg.styleSheets[0].disabled = true

    }, */
    dbOnGameStart(){
      if (!this.$store.state.gameSaved.start && this.$store.state.modeCollectStat) {
        this.$store.dispatch('db_startGame');
      }
    },

    dbOnGameEnd() {
      if (!this.$store.state.gameSaved.finish && this.$store.state.modeCollectStat) {
        this.$store.dispatch('db_endGame').then((result) => {
          // console.log(`dbOnGameEnd ${typeof result === 'object'? JSON.stringify(result): result}`);
          if (typeof result === 'object') {
            setTimeout(() => {
              let speechMess = '';
              this.$store.commit('snackbarMessage', 
                { value: speechMess = this.$i18n.t('message.prize'),
                  type: KidsConst.TYPE_PRIZE,
                  mdata: { prize: result.prize,
                    color: result.color } 
                });
              this.$emit('on-speak', speechMess);
            }, 6500); // allow redraw
            setTimeout( () => {
              this.$store.commit('setLastPrize', {value: result});
              setTimeout( () => {
                this.$store.commit('setLastPrize', {value: undefined});
              }, 10000);
            }, 15000);

          }
        });
      }
      /*
      if (!this.$store.state.gameSaved.finish && this.$store.state.modeCollectStat) {
        this.$store.dispatch('db_saveGame', {type: KidsConst.SAVED_FINISH}).then((result) => {
          console.log(`dbOnGameEnd start ${typeof result === 'object'? JSON.stringify(result): result}`);
          if (result === DB.DB_OK) {
            this.$store.dispatch('db_cacheGames');
            this.$store.dispatch('db_checkForPrize', {result} ).then((result) => {
              console.log(`dbOnGameEnd ${typeof result === 'object'? JSON.stringify(result): result}`);
              if (typeof result === 'object') {
                setTimeout(() => {
                  let speechMess = '';
                  this.$store.commit('snackbarMessage', 
                    { value: speechMess = this.$i18n.t('message.prize'),
                      type: KidsConst.TYPE_PRIZE,
                      mdata: { prize: result.prize,
                             color: result.color } 
                    });
                this.$emit('on-speak', speechMess);
                }, 7000); // allow redraw
              }
            });
          }
        });
      }
      */
    },

    actBackward() {
      this.game.undo();
      if (!this.twoPlayers) { // for AI we need 2 backmoves
        this.game.undo();
        this.$store.commit('actBackward');  
      }
      this.$store.commit('actBackward');  

      this.$store.commit('bestMove', { move: '' }); // clear last moveAI to watch 1 back move
      this.board.set({
        fen: this.game.fen(),
        turnColor: this.toColor(),
        movable: {
          color: this.toColor(),
          dests: this.possibleMoves(),
          events: { after: this.userPlay()},
        },

      });
      this.$store.commit('setTurn', { turn: this.game.turn() });
    },
    getHistory() {
      return this.game.history();
    },
    expandColor(c) {
      return c==='w'? KidsConst.WHITE: c==='b'? KidsConst.BLACK: undefined;
    },
    /***
     * check for chess or specil rules game end
     * side - KidsConst.HUMAN | KidsConst.ROBOT for one-player games
     *      - KidsConst.WHITE | KidsConst.BLACK (i.e. current turn) for two-player games
     * 
     * *****/
    checkRules(side){
      //TODO: do not check if finishedGame. reset finishedGame on back move (with checking of move number finishedGame occurs)
      // console.log(`side = ${side}`)      
      let rules = this.getTaskRules;
      let speechMess = '';
      if (rules & KidsConst.RULES_CHESS) { // regular chess rules
        if (this.game.in_checkmate()) {
          this.$store.commit('finishedGame', {value: true});
          if (this.twoPlayers)
            this.$store.commit('snackbarMessage', {value: speechMess = side===KidsConst.WHITE? this.$i18n.t('result.black_won'):this.$i18n.t('result.white_won') });
          else 
            this.$store.commit('snackbarMessage', {value: speechMess = side===KidsConst.HUMAN? this.$i18n.t('result.lost'):this.$i18n.t('result.won'),
                                                    type: side===KidsConst.HUMAN? KidsConst.TYPE_NEGATIVE: KidsConst.TYPE_POSITIVE });
          this.$emit('on-speak', speechMess);
          return true;
        } else if (this.game.in_draw()) {
          this.$store.commit('finishedGame', {value: true});
          let reason = this.game.insufficient_material()? this.$i18n.t('reason.insufficient_material'): 
                    this.game.in_stalemate()? this.$i18n.t('reason.stalemate'): 
                    this.game.in_threefold_repetition()? this.$i18n.t('reason.threefold'): '';
          this.$store.commit('snackbarMessage', {value: speechMess = `${this.$i18n.t('result.draw')} - ${reason}`});
          this.$emit('on-speak', speechMess);
          return true;
        }
      } 
      if ((rules & KidsConst.RULES_STALEMATE_WIN) && this.game.in_stalemate()) {// Win on No-Move opponent
        this.$store.commit('finishedGame', {value: true});
        if (this.twoPlayers)
          this.$store.commit('snackbarMessage', 
            {value:  speechMess = `${side===KidsConst.WHITE? this.$i18n.t('result.black_won'):this.$i18n.t('result.white_won')} - ${this.$i18n.t('reason.nomoves')}` });
        else 
          this.$store.commit('snackbarMessage', 
            {value: speechMess = `${side===KidsConst.HUMAN? this.$i18n.t('result.lost'):this.$i18n.t('result.won')} - ${this.$i18n.t('reason.nomoves')}`,
              type: side===KidsConst.HUMAN? KidsConst.TYPE_NEGATIVE: KidsConst.TYPE_POSITIVE });
        // console.log(`speechMess = ${speechMess}`)      
        this.$emit('on-speak', speechMess);
        return true;
      } 
      if (rules & KidsConst.RULES_SAFE_PROMOTION) {
        let history = this.game.history({verbose: true});
        // console.log(`history ${JSON.stringify(history)}`);
        /*
        if (history.length > 1 && history[history.length-2].flags.indexOf('p') >=0 && history[history.length-1].flags.indexOf('p') == -1 &&
            history[history.length-2].to !== history[history.length-1].to && 
            (history.length === 2 || (history.length > 2 && history[history.length-3].flags.indexOf('p') == -1))) { // no pair promotion
            */
        let forceFinish = undefined;   
        if (history.length > 0 && history[history.length-1].flags.indexOf('p') >=0) // there was promotion
        {
          let i=2;
          while (history.length-i >= 0 && history[history.length-i].flags.indexOf('p') >= 0) i++; // i == odd shows subsequental promotions
          if (i % 2 == 0) { // no pair promotion
            // check possible moves
            let moves = this.game.moves({verbose: true, legal: true});
            if (moves.find( (move) => { 
              return (move['captured'] && (move.to === history[history.length-1].to) || move['san'].includes('=')); }) === undefined) {
              // not possible to capture or promote 
              forceFinish = this.expandColor(history[history.length-1].color); 
              // console.log(`history 1 ${JSON.stringify(history[history.length-1])}`);

            }

          }
        }
        // now the old checking if could capture promoted piece, but didn't
        if (!forceFinish && (history.length > 1 && history[history.length-2].flags.indexOf('p') >=0 && history[history.length-1].flags.indexOf('p') == -1 &&
            history[history.length-2].to !== history[history.length-1].to && 
            (history.length === 2 || (history.length > 2 && history[history.length-3].flags.indexOf('p') == -1)))) { // no pair promotion
            forceFinish = this.expandColor(history[history.length-2].color); 
            // console.log(`history 2 ${JSON.stringify(history[history.length-2])}`);
        }
        if (forceFinish) {
          // console.log(`forceFinish ${forceFinish}`);
          this.$store.commit('finishedGame', {value: true});
          if (this.twoPlayers)
            this.$store.commit('snackbarMessage', 
              {value: speechMess = `${forceFinish===KidsConst.WHITE? this.$i18n.t('result.white_won'):this.$i18n.t('result.black_won')} - ${this.$i18n.t('reason.safe_promotion')}` });
          else
            this.$store.commit('snackbarMessage', 
              {value: speechMess =`${this.getOrientation === forceFinish? this.$i18n.t('result.won'):this.$i18n.t('result.lost')} - ${this.$i18n.t('reason.safe_promotion')}`,
               type: this.getOrientation === forceFinish? KidsConst.TYPE_POSITIVE: KidsConst.TYPE_NEGATIVE });
          this.$emit('on-speak', speechMess);
          return true;
        }
      } 
      if (rules & KidsConst.RULES_MATERIAL_WIN) {// Win on Material advantage
        let history = this.game.history({verbose: true});
        if (history.length > 0 && history[history.length-1].flags.indexOf('p') == -1) {  // no promotion on the last move
          let fen = this.game.fen().split(' ')[0];
          if ((fen.match(/p/gi) || []).length == 0) { // no pawns
            let wWeight = (fen.match(/Q/g) || []).length * KidsConst.QUEEN_WEIGHT +
                    (fen.match(/R/g) || []).length * KidsConst.ROOK_WEIGHT +
                    (fen.match(/B/g) || []).length * KidsConst.BISHOP_WEIGHT +
                    (fen.match(/N/g) || []).length * KidsConst.KNIGHT_WEIGHT;
            let bWeight = (fen.match(/q/g) || []).length * KidsConst.QUEEN_WEIGHT +
                    (fen.match(/r/g) || []).length * KidsConst.ROOK_WEIGHT +
                    (fen.match(/b/g) || []).length * KidsConst.BISHOP_WEIGHT +
                    (fen.match(/k/g) || []).length * KidsConst.KNIGHT_WEIGHT;
            // check if no capture possible
            let moves = this.game.moves({verbose: true, legal: true});
            if (moves.find( (move) => { return (move['captured'] || move['san'].includes('+')); }) === undefined) {
              let mess = '';
              let type = KidsConst.TYPE_NONE;
              if (wWeight === bWeight) {
                mess = this.$i18n.t('result.draw');
              } else if (this.twoPlayers) {
                mess = wWeight - bWeight > 0?  this.$i18n.t('result.white_won'):  this.$i18n.t('result.black_won');
              } else {
                  if ((wWeight - bWeight > 0 && this.getOrientation === KidsConst.WHITE) ||
                  (wWeight - bWeight < 0 && this.getOrientation === KidsConst.BLACK)) {
                    mess = this.$i18n.t('result.won');
                    type = KidsConst.TYPE_POSITIVE;
                  } else {
                    mess = this.$i18n.t('result.lost'); 
                    type = KidsConst.TYPE_NEGATIVE;
                  }       
              }
              this.$store.commit('finishedGame', {value: true});
              this.$store.commit('snackbarMessage', 
                {value: speechMess = `${mess} - ${this.$i18n.t('reason.material')}`, type });
              this.$emit('on-speak', speechMess);
              return true;
            }
          }

        }
      }
      if ((rules & KidsConst.RULES_3_REPETITION) && this.game.in_threefold_repetition())  {// Draw on threfold repetitionRULES_3_REPETITIONaterial advantage
          this.$store.commit('finishedGame', {value: true});
          this.$store.commit('snackbarMessage', 
            {value: speechMess = `${this.$i18n.t('result.draw')} - ${this.$i18n.t('reason.threefold')}` });
          this.$emit('on-speak', speechMess);
          return true;
      }
      if ((rules & KidsConst.RULES_WHITE_MATE_IN_X) || (rules & KidsConst.RULES_BLACK_MATE_IN_X)) {
        let maxMove = ((rules >> (Math.log2(KidsConst.RULES_BLACK_MATE_IN_X)+1)) & KidsConst.MASK_MATE_IN_X);  
        if (this.movesNumberOut(maxMove, (rules & KidsConst.RULES_BLACK_MATE_IN_X))) {
          this.$store.commit('finishedGame', {value: true});
          this.$store.commit('snackbarMessage', 
            {value: speechMess = `${this.$i18n.t('result.draw')} - ${this.$i18n.t('reason.no_win_in_x_moves', [maxMove])}` });
          this.$emit('on-speak', speechMess);
          return true;

        }
      }
      return false;
    },
    //}
    /*
    gameLoaded() {
      this.$store.commit('canReload', {value: false})  
    }, */

  },
  computed: {
    ...mapGetters(['isMoveOf', 'getTaskRules', 'getOrientation','movesNumberOut','twoPlayers']),
  },
  watch: {
    // for the new task
    id: function() { 
      //console.log(`KidsBoard Watcher id`); // eslint-disable-line no-console ,
      this.initialMove();
      //Speech.clear();
      //Speech.talk(`${this.$i18n.t(this.$store.getters.getCurrentTask.title)}.`, this.$i18n.locale);
      //Speech.talk(this.$i18n.t(this.$store.getters.getCurrentTask.description), this.$i18n.locale);
      this.$emit('on-speak');

    }, 
    // to reload the current task
    forced: function() { 
      //console.log(`KidsBoard Watcher forced`); // eslint-disable-line no-console ,
      this.loadPosition(); 
      this.$store.commit('setGameActive', {value: false}); 
      this.initialMove(); 
      this.$store.commit('finishedGame', {value: false});
      // console.log('board-reload'); // eslint-disable-line no-console ,
    }, 
    '$store.state.modeTwoPlayers': function() {
        // console.log(this.$store.state.modeTwoPlayers);
      this.launchMoveSequence();    
    },
  },
  created() {
    this.unwatch = this.$store.watch(  // https://vuex.vuejs.org/api/#watch
      (state, getters) => getters.moveAI,
      (newValue /*, oldValue*/) => {
        // console.log(`KidsBoard Watcher MoveAI ${newValue}`); // eslint-disable-line no-console ,
        if (newValue.length === 0) // '' clears on backmove
          return;
        if (newValue.length === 4) {
          let orig = newValue.slice(0,2);
          let dest = newValue.slice(2);
          if (this.isPromotion(orig, dest)) {
            this.promoteTo = this.onPromotion();
            // this.$store.commit('canReload', {value: true});  // can reload close to finish game
          }
          this.game.move({from: orig, to: dest, promotion: this.promoteTo}) // promote to queen for simplicity
          this.board.set({
            movable: {
              color: this.toColor(), // enable moves
            }
          });
          this.board.move(orig, dest);
          this.board.set({
            turnColor: this.toColor(),
            movable: {
              color: this.toColor(),
              dests: this.possibleMoves(),
              events: { after: this.userPlay()},
            },

          });
        } else {
          console.log(`AI move unparced ${newValue}`); // eslint-disable-line no-console
          this.game.move(newValue, { sloppy: true }); 

          this.board.set({
            fen: this.game.fen(),
            turnColor: this.toColor(),
            movable: {
              color: this.toColor(),
              dests: this.possibleMoves(),
              events: { after: this.userPlay()},
            },

          });
        }
        this.calculatePromotions();
        this.$store.commit('setTurn', { turn: this.game.turn() });
        this.$store.commit('addMove', {move: newValue});
        this.afterMove();
        let res = this.checkRules(KidsConst.HUMAN);
        if(res) { // stop game
          this.board.set({
            movable: {
              color: undefined,
              dests: undefined,
              events: { after: undefined},
            },
          });
          /*
          if (!this.$store.state.gameSaved.finish && this.$store.state.modeCollectStat) {
            this.$store.dispatch('db_SaveGame', {type: KidsConst.SAVED_FINISH});
          } */
          this.dbOnGameEnd();
        }
      },
    );
  },

  beforeDestroy() {
    this.unwatch();
    DB.close();
  },
};
</script>


<style>
  .v-application .cg-board .black,
  .v-application .cg-board .white, 
  .v-application .kidsboard .blue
  {
    background-color: transparent !important;
  } 
  .v-application cg-board piece.black,
  .v-application cg-board piece.white, 
  .v-application .kidsboard .blue,
  .cg-board-wrap coords.ranks, .cg-board-wrap  coords.files
  {
    background-color: transparent !important;
  }

/*  .merida cg-board piece.pawn.white
  {
  } */

</style> 
