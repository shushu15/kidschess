
<script>
import { chessboard }  from 'vue-chessboard'
// import {aiMoveExport} from '@/lib/ai/js-chess-engine/js-chess-engine';
// import {aiMoveExport} from '@/lib/ai/js-chess-engine.mjs'

export default {
  name: 'KidsBoard',
  extends: chessboard,
  props: {
    fen: String,
    orientation: String,
    id: String,
  },
  methods: {
    initialMove() {
      setTimeout(() => {
        // this.showMoves(); 
        this.board.set({
          movable: { events: { after: this.userPlay()} },
        });
        this.$store.commit('setTurn', { turn: this.game.turn() });
       }, 1000);
    },     
    userPlay() {
      return (orig, dest) => {
        if (this.isPromotion(orig, dest)) {
          this.promoteTo = this.onPromotion()
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
      /*
      let enginemove = aiMoveExport (this.game.fen(), 3);    
      console.log(`Move ${enginemove.from} ${enginemove.to}`);

      this.game.move(enginemove);

      this.board.set({
        fen: this.game.fen(),
        turnColor: this.toColor(),
        movable: {
          color: this.toColor(),
          dests: this.possibleMoves(),
          events: { after: this.userPlay()},
        }
      });
      this.$store.commit('setTurn', { turn: this.game.turn() });
      */
      // WORKER
      this.$store.dispatch('workerRequest', { message: this.game.fen() }); 
    },  

  },
  watch: {
    id: function() { this.initialMove(); console.log('change id'); } // eslint-disable-line no-console ,
  },
  created() {
    this.unwatch = this.$store.watch(  // https://vuex.vuejs.org/api/#watch
      (state, getters) => getters.moveAI,
      (newValue, oldValue) => {
        console.log(`Updating from ${oldValue} to ${newValue}`);
        this.game.move(newValue, { sloppy: true }); 
        this.board.set({
          fen: this.game.fen(),
          turnColor: this.toColor(),
          movable: {
            color: this.toColor(),
            dests: this.possibleMoves(),
            events: { after: this.userPlay()},
          }
        });
        this.$store.commit('setTurn', { turn: this.game.turn() });
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


</style> 
