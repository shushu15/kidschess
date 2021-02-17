
<script>
import { chessboard }  from 'vue-chessboard'
import {aiMoveExport} from '@/lib/ai/js-chess-engine/js-chess-engine';
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
/*      let obMove = aiMoveExport (this.game.fen(), 3);    
      let arMove = Object.entries(obMove);
      let enginemove = {};
      if (arMove.lenth > 0) {
        enginemove = { from: arMove[0][0], to: arMove[0][1] };
      } */
      let enginemove = aiMoveExport (this.game.fen(), 3);    
      console.log(`Move ${enginemove}`);

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
    },       
  },
  watch: {
    id: function() { this.initialMove(); console.log('change id'); } // eslint-disable-line no-console ,
  },
  mounted() {
    // this.AIgame = new jsChess.Game();
  }
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
