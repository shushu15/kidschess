<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1 class="display-2 font-weight-bold mb-3">
           {{this.$store.getters.getCurrentTask.title.ru}}   
        </h1>
      </v-col>

      <v-col class="mb-4">
        <KidsBoard ref="wrkBoard" :fen='this.$store.getters.getCurrentTask.fen' :orientation='this.$store.getters.getCurrentTask.orientation' />
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
            {{this.$store.getters.getCurrentTask.description.ru}}        
        </h2>
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
       this.$store.commit('setChild', { child: this.tasks[taskIdx].data[subIdx] });
      // this.currentTask = this.tasks[taskIdx].data[subIdx];
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
  },
   created() {
       this.$store.commit('setChild', { child: this.tasks[0].data[0] });
  } 

  }
</script>
