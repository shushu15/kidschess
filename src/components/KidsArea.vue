<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1 class="display-2 font-weight-bold mb-3">
           {{this.currentTask.title.ru}}   
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
            {{this.currentTask.description.ru}}        
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
  props: {
    tasks: Array,
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
    loadTask(taskIdx, subIdx) {
      this.currentTask = this.tasks[taskIdx].data[subIdx];
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
   mounted() {
    this.loadTask(0, 0);             
  }    
  }
</script>
