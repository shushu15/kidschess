
<script>
import { chessboard }  from 'vue-chessboard'
import {aiMoveExport} from '@/lib/ai/js-chess-engine.mjs'

export default {
  name: 'KidsBoard',
  extends: chessboard,
  methods: {
    initialMove() {
      setTimeout(() => {
        // this.showMoves(); 
        this.board.set({
          movable: { events: { after: this.userPlay()} },
        })
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
        this.calculatePromotions()
        this.aiNextMove()
      };
    },
    aiNextMove() {
     let enginemove = aiMoveExport (this.game.fen(), 3);    
     // console.log(`Move ${enginemove}`);

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
    },       
  },
  mounted() {
    this.board.set({
      movable: { events: { after: this.userPlay()} },
    })
  }
}
</script>
