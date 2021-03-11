
<script>
import {  mapGetters } from 'vuex'; 
import { chessboard }  from '@/components/vendor/chessboard/index.js';
import * as KidsConst from '@/lib/const.js';
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
  },
  methods: {
    initialMove() {
      // this.gameLoaded();
      // setTimeout(() => {
        this.board.set({
          movable: { events: { after: this.userPlay()} },
        });
        this.$store.commit('setTurn', { turn: this.game.turn() });
       // }, 1000);
       this.$store.commit('setHistoryFen');  // no paraneters - clear history
       if (this.isMoveOf(KidsConst.HUMAN)) { // if move of HUMAN save its fen
        this.$store.commit('setHistoryFen', {fen: this.game.fen()});
       }

    },     
    userPlay() {
      return (orig, dest) => {
        // console.log(`userPlay ${orig} ${dest}`);
        this.$store.commit('setGameActive', {value: true})
        if (this.isPromotion(orig, dest)) {
          this.promoteTo = this.onPromotion();
          // this.$store.commit('canReload', {value: true});  // can reload close to finish game
        }
        this.game.move({from: orig, to: dest, promotion: this.promoteTo}) // promote to queen for simplicity
        this.board.set({
          fen: this.game.fen()
        })
        this.calculatePromotions();
        this.$store.commit('setTurn', { turn: this.game.turn() });
         setTimeout(() => {this.aiNextMove();}, 100); // allow redraw
      }
    },
    aiNextMove() {
      this.$store.commit('setGameActive', {value: true})
      this.checkRules(KidsConst.ROBOT);  // check rules before AI move on its turn
      this.board.set({
        movable: {
          color: undefined, // disable moves
        }
      })
      // WORKER
      this.$store.dispatch('workerSendPosition', { position: this.game.fen() }); 
    }, 
    actBackward() {
      this.game.undo();
      this.game.undo();
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
    // check for chess or specil rules game end
    checkRules(side){
      //TODO: do not check if finishedGame. reset finishedGame on back move (with checking of move number finishedGame occurs)
      let rules = this.getTaskRules;
      if (rules & KidsConst.RULES_CHESS) { // regular chess rules
        if (this.game.in_checkmate()) {
          this.$store.commit('finishedGame', {value: true});
          this.$store.commit('snackbarMessage', {value: side===KidsConst.HUMAN? this.$i18n.t('result.lost'):this.$i18n.t('result.won') });
          return true;
        } else if (this.game.in_draw()) {
          this.$store.commit('finishedGame', {value: true});
          this.$store.commit('snackbarMessage', {value: this.$i18n.t('result.draw')});
          return true;
        }
      } 
      if ((rules & KidsConst.RULES_STALEMATE_WIN) && this.game.in_stalemate()) {// Win on No-Move opponent
        this.$store.commit('finishedGame', {value: true});
        this.$store.commit('snackbarMessage', {value:  side===KidsConst.HUMAN? this.$i18n.t('result.lost'):this.$i18n.t('result.won')});
        return true;
      } 
      if (rules & KidsConst.RULES_SAFE_PROMOTION) {
        let history = this.game.history({verbose: true});
        // console.log(`history ${JSON.stringify(history)}`);
        if (history.length > 1 && history[history.length-2].flags.indexOf('p') >=0 && history[history.length-1].flags.indexOf('p') == -1 &&
            history[history.length-2].to !== history[history.length-1].to) {
          this.$store.commit('finishedGame', {value: true});
          this.$store.commit('snackbarMessage', {value: side===KidsConst.HUMAN? this.$i18n.t('result.won'):this.$i18n.t('result.lost') });
          return true;
        }
      } 
      if ((rules & KidsConst.RULES_MATERIAL_WIN) && this.game.in_stalemate()) {// Win on Material advantage
        //TODO: MATERIAL_WIN
      }
      return false;
    }
    //}
    /*
    gameLoaded() {
      this.$store.commit('canReload', {value: false})  
    }, */

  },
  computed: {
    ...mapGetters(['isMoveOf', 'getTaskRules']),
  },
  watch: {
    id: function() { 
      //console.log(`KidsBoard Watcher id`); // eslint-disable-line no-console ,
      this.initialMove();
    }, 
    forced: function() { 
      //console.log(`KidsBoard Watcher forced`); // eslint-disable-line no-console ,
      this.loadPosition(); 
      this.$store.commit('setGameActive', {value: false}); 
      this.initialMove(); 
      this.$store.commit('finishedGame', {value: false});
      // console.log('board-reload'); // eslint-disable-line no-console ,
    }, 
  },
  created() {
    this.unwatch = this.$store.watch(  // https://vuex.vuejs.org/api/#watch
      (state, getters) => getters.moveAI,
      (newValue /*, oldValue*/) => {
        //console.log(`KidsBoard Watcher MoveAI ${newValue}`); // eslint-disable-line no-console ,
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
        // get FEN before HUMAN move
        this.$store.commit('setHistoryFen', {fen: this.game.fen()});
        this.checkRules(KidsConst.HUMAN);
      },
    );
  },

  beforeDestroy() {
    this.unwatch();
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


</style> 
