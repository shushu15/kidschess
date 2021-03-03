
<script>
import {  mapGetters } from 'vuex'; 
import { chessboard }  from '@/components/vendor/chessboard/index.js'
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
       if (this.isMoveOf(this.$store.state.HUMAN)) { // if move of HUMAN save its fen
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
         setTimeout(() => {this.aiNextMove();}, 50); // allow redraw
      }
    },
    aiNextMove() {
      this.$store.commit('setGameActive', {value: true})
      // WORKER
      this.$store.dispatch('workerRequest', { message: this.game.fen() }); 
    }, 
    actBackward() {
      this.game.undo();
      this.game.undo();
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
    } 
    /*
    gameLoaded() {
      this.$store.commit('canReload', {value: false})  
    }, */

  },
  computed: {
    ...mapGetters(['isMoveOf']),
  },
   watch: {
    id: function() { 
      this.initialMove();
      // console.log('change id'); // eslint-disable-line no-console ,
    }, 
    forced: function() { 
      this.loadPosition(); 
      this.$store.commit('setGameActive', {value: false}); 
      this.initialMove(); 
      // console.log('board-reload'); // eslint-disable-line no-console ,
    }, 
  },
  created() {
    this.unwatch = this.$store.watch(  // https://vuex.vuejs.org/api/#watch
      (state, getters) => getters.moveAI,
      (newValue /*, oldValue*/) => {
        // console.log(`Updating from ${oldValue} to ${newValue}`);
        if (newValue.length === 4) {
          let orig = newValue.slice(0,2);
          let dest = newValue.slice(2);
          if (this.isPromotion(orig, dest)) {
            this.promoteTo = this.onPromotion();
            // this.$store.commit('canReload', {value: true});  // can reload close to finish game
          }
          this.game.move({from: orig, to: dest, promotion: this.promoteTo}) // promote to queen for simplicity
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
          console.log(`AI move unparced ${newValue}`);
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
        this.$store.commit('setHistoryFen', {fen: this.game.fen()});
      },
    );
  },
  beforeDestroy() {
    this.unwatch();
  },
//  mounted() {
//    // this.AIgame = new jsChess.Game();
//  }
}
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
