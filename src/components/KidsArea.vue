<template>
  <v-container class="kidsarea">
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
    <div class="cartoon">
    <transition name="sliding">
      <inline-svg v-if="flashAnimal"  :src="this.cartoonByID(this.$store.getters.getCurrentTask.service.id)" width="100" height="100" class="anim" />
    </transition> 
    </div>
    
  </v-container>
</template>

<script>
import {  mapGetters } from 'vuex'; 
import KidsBoard from './KidsBoard.vue';
import InlineSvg from 'vue-inline-svg';

  export default {
    name: 'KidsArea',

    components: {
      KidsBoard,
      InlineSvg,
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
    cartoonByID(id) {
      let childFound = undefined;
      let cartoonFound = undefined;
      for (let i=0; i < this.tasks.length && childFound === undefined; i++) {
        childFound = this.tasks[i].data.find((child) => child.service.id === id);
        if (childFound !== undefined) {
          if(childFound.avatar !== undefined)  // check first avatar field inside task
            cartoonFound = childFound.avatar;
          else if (this.tasks[i].cartoon !== undefined) // then specific cartoon field fo group
            cartoonFound = this.tasks[i].cartoon;
          else // then use avatar of the group
            cartoonFound = this.tasks[i].avatar;
          return cartoonFound;    
        }
      }
      // standard game
      cartoonFound = (this.standard.service.id === id)? this.standard.avatar: ""; //undefined;
      return cartoonFound;
    },

    /*
    loadFen(fen) {
      this.currentFen = fen
    }, */
    /*
    loadTask(taskIdx, subIdx) {
       this.$store.commit('setChild', { child: this.tasks[taskIdx].data[subIdx] });
      // this.currentTask = this.tasks[taskIdx].data[subIdx];
      this.$refs.wrkBoard.initialMove();
    }, */
    //reloadTask() {
    //  this.$refs.wrkBoard.initialMove();
    //},

    promote() {
      if (confirm("Want to promote to rook? Queen by default") ) {
        return 'r'
      } else {
        return 'q'
      }
    }
  }, 
     computed: {
    ...mapGetters(['showClock','showBtnStart','flashAnimal']),
  },
    
  mounted() {
    // this.loadTask(0, 0); 
    // this.reloadTask();      
    this.$refs.wrkBoard.initialMove();

  },
 //   created() {
//       this.$store.commit('setChild', { child: this.tasks[0].data[0] });
 //     this.reloadTask();      
  //  } 

  }
</script>

<style scoped>
  .layer1 {
    position: relative; 
  }
  .kidsarea {
    position: relative; 
  }
  .cartoon {
    /* z-index: 201; */
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    /* display: flex; */
    /* justify-content:space-between; */
    /* flex-direction:column; */
  }  
  .anim {
    position: absolute;
    top: 400px;
    left: 0;
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
  .sliding-enter-active {
    animation: sliding 0.5s;
  }
  .sliding-leave-active {
    animation: sliding 0.5s reverse;
  }
/*
.sliding-enter, .sliding-leave-to
  transform: translateY(200px);
  opacity: 0;
} */

@keyframes sliding {
  0% {
    transform: translateX(-100vw);
    /* transform: scale(0.5); */
  }
  100% {
    transform: translateX(0);
  } 
}  


</style> 
