<template>
  <v-container>
    <v-row class="text-center">

      <v-col class="d-flex justify-center">
        <div class="layer1 pa-5 rounded-lg">       
        <KidsBoard ref="wrkBoard" class="kidsboard" :fen='this.$store.getters.getCurrentTask.fen' :orientation='this.$store.getters.getCurrentTask.orientation' 
              :id='this.$store.getters.getCurrentTask.service.id' :forced="this.forced" @on-orientation="flippedBoard"/>
         <div class="clock-opp"><v-icon  v-if="showClock('b')">
            mdi-alarm
        </v-icon></div>     
         <div class="clock-my"><v-icon v-if="showClock('w')">
            mdi-alarm
        </v-icon></div> 
        <v-fade-transition v-if="showBtnStart">
          <div  class="action-buttons">
            <v-btn v-if="showBtnStart" rounded color="primary"  @click="bntGameStart">{{ $t('btn.game.start') }}</v-btn>
           </div>
         </v-fade-transition>     
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
import {  mapGetters } from 'vuex'; 
import KidsBoard from './KidsBoard.vue';
  export default {
    name: 'KidsArea',

    components: {
      KidsBoard,
    },
  props: {
    tasks: Array,
    forced: Date,
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
    bntGameStart() {
      this.$refs.wrkBoard.aiNextMove();
    },
    flippedBoard() {
      if (this.$store.getters.isMoveOf(this.$store.state.HUMAN))
        this.$refs.wrkBoard.initialMove();
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
     computed: {
    ...mapGetters(['showClock','showBtnStart']),
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
