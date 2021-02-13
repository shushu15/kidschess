<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1 class="display-2 font-weight-bold mb-3">
           {{this.currentTask.title}}   
        </h1>
      </v-col>

      <v-col class="mb-4">
        <KidsBoard ref="wrkBoard" :fen='currentTask.fen' :orientation='currentTask.orientation' />
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
            {{this.currentTask.description}}        
        </h2>
        <button class="button is-light" v-for="task in tasks"  @click="loadTask(task)" :key="task.fen + task.orientation">
            {{task.title}}
        </button>

      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import KidsBoard from './KidsBoard.vue';
  export default {
    name: 'KidsArea',

    components: {
      KidsBoard,
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
