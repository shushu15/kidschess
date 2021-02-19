<template>
  <v-container>
    <v-row class="text-center">

      <v-col class="d-flex justify-center">
        <div class="layer1 pa-5 rounded-lg">       
        <KidsBoard ref="wrkBoard" class="kidsboard" :fen='this.$store.getters.getCurrentTask.fen' :orientation='this.$store.getters.getCurrentTask.orientation' 
              :id='this.$store.getters.getCurrentTask.service.id'/>
         <div class="clock-opp"><v-icon  v-if="$store.getters.getTurn==='b'">
            mdi-alarm
        </v-icon></div>     
         <div class="clock-my"><v-icon v-if="$store.getters.getTurn==='w'">
            mdi-alarm
        </v-icon></div>     
         </div>     
      </v-col>
    </v-row>
    <v-row class="text-center">

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-medium mb-3">
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
    /*
    loadFen(fen) {
      this.currentFen = fen
    }, */
    
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
//   created() {
//       this.$store.commit('setChild', { child: this.tasks[0].data[0] });
//  } 

  }
</script>

<style scoped>
  .layer1 {
    position: relative; 
  }
  .clock-opp {
    position: absolute;
    top: 0px;
    right: 0px;
  } 
  .clock-my {
    position: absolute;
    bottom: 0px;
    right:  0px;
  } 


</style> 
