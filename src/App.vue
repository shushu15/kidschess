<template>
  <div id="app">
    <h1>Козлята</h1>
    <article>
    <newboard ref="wrkBoard" :fen='currentTask.fen' :orientation='currentTask.orientation' />
    <div>
      {{this.currentTask.description}}
    </div>
    </article>
    <aside>
      <button class="button is-light" @click="loadTask(task)" v-for="task in tasks"  :key="task.fen + task.orientation">
      {{task.title}}
      </button>
    </aside>



  </div>
</template>

<script>
// import {chessboard} from 'vue-chessboard'
import 'vue-chessboard/dist/vue-chessboard.css'
import newboard from './newboard.vue'
// import editor from './editor.vue'

export default {
  name: 'app',
  components: {
    // chessboard,
    newboard,
    // editor
  },
  data () {
    return {
      currentFen: '',
      positionInfo: null,
      currentTask: {}      
    }
  },
  methods: {
    showInfo(data) {
      this.positionInfo = data
    },
    loadFen(fen) {
      this.currentFen = fen
    },
    loadTask(task) {
      this.currentTask = task;
      this.$refs.wrkBoard.initialMove();
    },    
    promote() {
      if (confirm("Want to promote to rook? Queen by default") ) {
        return 'r'
      } else {
        return 'q'
      }
    }
  },
  created() {
    this.fens = ['5rr1/3nqpk1/p3p2p/Pp1pP1pP/2pP1PN1/2P1Q3/2P3P1/R4RK1 b - f3 0 28',
                'r4rk1/pp1b3p/6p1/8/3NpP2/1P4P1/P2K3P/R6R w - - 0 22'
                ];
    this.tasks = [
      { 
        title: 'Предварительное упражнение 10.3',
        fen: '8/8/3P4/4P3/P7/8/8/3r4 w - - 0 1',
        description: 'Здесь выигрывает тот, кто первый ходит. Найди путь к победе за белых.',
        orientation: 'white'
      },
      {
        title: 'Предварительное упражнение 10.3',
        fen: '8/8/3P4/4P3/P7/8/8/3r4 b - - 0 1',
        description: 'Здесь выигрывает тот, кто первый ходит. Найди путь к победе за чёрных.',
        orientation: 'black'
      },
      {
        title: 'Козлята и волк - ладья, 10 ступень',
        fen: '4r3/8/8/8/8/8/2PPPPP1/8 w - - 0 1',
        description: 'Ладья против пяти связанных пешек.  Научиться играть за КОЗЛЯТ',
        orientation: 'white'
      },
      {
        title: 'Козлята и волк - ладья, 10 ступень',
        fen: '4r3/8/8/8/8/8/2PPPPP1/8 b - - 0 1',
        description: 'Ладья против пяти связанных пешек. Научиться побеждать за ВОЛКА',
        orientation: 'black'
      },
    ];
  },
   mounted() {
    this.loadTask(this.tasks[0]);             
  }
}
</script>
