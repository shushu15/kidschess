
<script>
import {  mapGetters } from 'vuex'; 
import { chessboard }  from '@/components/vendor/chessboard/index.js';
import * as KidsConst from '@/lib/const.js';
import '@/lib/parse-transform.js';

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
       this.$store.commit('addMove');  // no paraneters - clear history
       //if (this.isMoveOf(KidsConst.HUMAN)) { // if move of HUMAN save its fen
       // this.$store.commit('setHistoryFen', {fen: this.game.fen()});
       // }

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
        this.$store.commit('addMove', {move: `${orig}${dest}`});
        this.$store.commit('setTurn', { turn: this.game.turn() });
        if (this.twoPlayers) {
          this.checkRules(KidsConst.ROBOT);  // check rules before AI move on its turn
          this.board.set({
            turnColor: this.toColor(),
            movable: {
              color: this.toColor(),
              dests: this.possibleMoves(),
              events: { after: this.userPlay()},
            }
          });
          this.flipFiguresCSS();
        }
        else  // AI player
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
      // for dynamic depth positions get fen first
      let dynamic = false
      if (this.$store.getters.getCurrentTask.dynamic) {
        let fen = this.game.fen().split(' ')[0];
        if ((fen.match(/p/gi) || []).length == 0)// no pawns
          dynamic = true;
      }

      // WORKER
      // either initial position + all moves (for 3times repetition prevent), or regular current fen
      if (this.$store.getters.getCurrentTask.movesAI)
        this.$store.dispatch('workerSendPosition', { position: this.$store.getters.getCurrentTask.fen, moves: this.$store.state.history.moves, dynamic}); 
      else  
        this.$store.dispatch('workerSendPosition', { position: this.game.fen(), dynamic }); 
    }, 
    flipFiguresCSS() {
          let elements = this.$el.querySelectorAll('cg-board piece');
          elements.forEach(element => {
            let t =  element.style.transform;
            let tt= t.parseTransform();
            if (tt.rotate) tt.rotate = 'undefined';
            else tt.rotate  = {a:"180",x:0,y:0};
            //element.style.transform = `${t} rotate(180deg)`
            element.style.transform = `${tt.toString()}`;
            console.log(`element ${tt.toString()}`);});
          // elements.forEach(element => {console.log(`element ${element.getAttribute("style")}`);});
          //let elements=this.$el.getElementsByTagName("piece");
          // elements.forEach(element => {console.log(`element ${element.contentDocument()}`);});
        // svg.styleSheets[0].disabled = true

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
          let reason = this.game.insufficient_material()? this.$i18n.t('reason.insufficient_material'): 
                    this.game.in_stalemate()? this.$i18n.t('reason.stalemate'): 
                    this.game.in_threefold_repetition()? this.$i18n.t('reason.threefold'): '';
          this.$store.commit('snackbarMessage', {value: `${this.$i18n.t('result.draw')} - ${reason}`});
          return true;
        }
      } 
      if ((rules & KidsConst.RULES_STALEMATE_WIN) && this.game.in_stalemate()) {// Win on No-Move opponent
        this.$store.commit('finishedGame', {value: true});
        this.$store.commit('snackbarMessage', 
          {value:  `${side===KidsConst.HUMAN? this.$i18n.t('result.lost'):this.$i18n.t('result.won')} - ${this.$i18n.t('reason.nomoves')}` });
        return true;
      } 
      if (rules & KidsConst.RULES_SAFE_PROMOTION) {
        let history = this.game.history({verbose: true});
        // console.log(`history ${JSON.stringify(history)}`);
        if (history.length > 1 && history[history.length-2].flags.indexOf('p') >=0 && history[history.length-1].flags.indexOf('p') == -1 &&
            history[history.length-2].to !== history[history.length-1].to && 
            (history.length === 2 || (history.length > 2 && history[history.length-3].flags.indexOf('p') == -1))) { // no pair promotion
          this.$store.commit('finishedGame', {value: true});
          this.$store.commit('snackbarMessage', 
            {value: `${side===KidsConst.HUMAN? this.$i18n.t('result.won'):this.$i18n.t('result.lost')} - ${this.$i18n.t('reason.safe_promotion')}` });
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
            let mess = '';
            if (wWeight === bWeight) {
              mess = this.$i18n.t('result.draw');
            } else if ((wWeight - bWeight > 0 && this.getOrientation === KidsConst.WHITE) ||
              (wWeight - bWeight < 0 && this.getOrientation === KidsConst.BLACK)) {
              mess = this.$i18n.t('result.won');
            } else {
              mess = this.$i18n.t('result.lost'); 
            }
            this.$store.commit('finishedGame', {value: true});
            this.$store.commit('snackbarMessage', 
              {value: `${mess} - ${this.$i18n.t('reason.material')}` });
            return true;
          }

        }
      }
      if ((rules & KidsConst.RULES_3_REPETITION) && this.game.in_threefold_repetition())  {// Draw on threfold repetitionRULES_3_REPETITIONaterial advantage
          this.$store.commit('finishedGame', {value: true});
          this.$store.commit('snackbarMessage', 
            {value: `${this.$i18n.t('result.draw')} - ${this.$i18n.t('reason.threefold')}` });
          return true;
      }
      if ((rules & KidsConst.RULES_WHITE_MATE_IN_X) || (rules & KidsConst.RULES_BLACK_MATE_IN_X)) {
        let maxMove = ((rules >> (Math.log2(KidsConst.RULES_BLACK_MATE_IN_X)+1)) & KidsConst.MASK_MATE_IN_X);  
        if (this.movesNumberOut(maxMove, (rules & KidsConst.RULES_BLACK_MATE_IN_X))) {
          this.$store.commit('finishedGame', {value: true});
          this.$store.commit('snackbarMessage', 
            {value: `${this.$i18n.t('result.draw')} - ${this.$i18n.t('reason.no_win_in_x_moves', [maxMove])}` });
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
        this.$store.commit('addMove', {move: newValue});
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
  /* 
  .merida
  {
    transform: rotate(180deg) !important;
  }*/


</style> 
