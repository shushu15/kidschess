<template>
  <v-container class="kidsarea">
    <div class="cartoon">
    <transition name="sliding">
      <inline-svg v-if="flashAnimal"  :src="cartoonByID(this.$store.getters.getCurrentTask.id)" width="100" height="100" class="anim" />
    </transition> 
    </div>
    <v-row class="text-center">

      <v-col class="d-flex justify-center" cols="12">
        <div class="layer1 pa-4 ma-0 rounded-lg">       
        <KidsBoard ref="wrkBoard" :fen='this.$store.getters.getCurrentTask.fen' :orientation='this.$store.getters.getCurrentTask.orientation' 
              :id='this.$store.getters.getCurrentTask.id' :forced="this.forced" @on-orientation="flippedBoard"/>
         <div class="clock-opp"><v-icon  v-if="showClock('b')">
            mdi-alarm
        </v-icon></div>     
         <div class="clock-my"><v-icon v-if="showClock('w')">
            mdi-alarm
        </v-icon></div>
         </div>  
      </v-col>
    </v-row>
    <v-row class="ma-0 pa-0">
      <v-col class="d-flex justify-center ma-0 pa-0" cols="12">
        <v-btn  icon  class="mx-4" color="blue" @click="actBackward" :disabled="!canBackward" >
            <v-icon>mdi-step-backward</v-icon>
        </v-btn> 
        <v-tooltip v-model="showCopy" top :open-on-hover="false" :open-on-click="false" >
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon class="mx-4" color="blue" @click="actInfo"  v-bind="attrs" v-on="on">
              <v-icon>mdi-information</v-icon>
            </v-btn> 
          </template>
          <span>{{this.copyMessage}}</span>
        </v-tooltip>
       </v-col> 
    </v-row>
    <v-row class="text-center">
      <v-col cols="12" class="ma-0 pa-0">
        <v-fade-transition v-if="showBtnStart">
          <div >
            <v-btn v-if="showBtnStart" rounded color="primary"  @click="bntGameStart">{{ $t('btn.game.start') }}</v-btn>
           </div>
         </v-fade-transition>     
      </v-col>
    </v-row>  
    <v-row class="text-center">
      <v-col
        cols="12"
      >
        <div class="text-subtitle-1">
            {{this.$store.getters.getCurrentTask.description[$i18n.locale]}}        
        </div>
      </v-col>

    </v-row>
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      color="blue-grey"
    >
      {{this.$store.state.snackbarMessage}}

      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          {{ $t('btn.close') }}
        </v-btn>
      </template>
    </v-snackbar>
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
    // tasks: Array,
    forced: Date,
  }, 
  data () {
    return {
      showCopy: false,
      copyMessage: '',
    }
  },  
  /* data () {
    return {
      currentFen: '',
      positionInfo: null,
    }
  }, */
  methods: {
/*    showInfo(data) {
      this.positionInfo = data
    }, */
    bntGameStart() {
      this.$refs.wrkBoard.aiNextMove();
    },
    flippedBoard() {
      if (this.$store.getters.isMoveOf(this.$store.state.HUMAN))
        this.$refs.wrkBoard.initialMove();
    }, 
    actBackward() {
      if (this.$store.state.history.fen.length > 1) {
        this.$store.commit('actBackward');  
        this.$refs.wrkBoard.actBackward();
      }
    },
    actInfo() {
      let self = this;
      navigator.permissions.query({name: "clipboard-write"}).then(result => {
        if (result.state == "granted" || result.state == "prompt") {
          /* write to the clipboard now */
          let s = `${this.$store.getters.getCurrentTask.title[this.$i18n.locale]}\n${this.$store.getters.getCurrentTask.fen}\n${this.$refs.wrkBoard.getHistory().join(' ')}`;
          console.log(s);
          this.updateClipboard(s, self);
          
        }
      });
      //console.log(this.$store.getters.getCurrentTask.title[this.$i18n.locale]);
      //console.log(this.$store.getters.getCurrentTask.fen);
      //console.log(this.$refs.wrkBoard.getHistory());
    },
    updateClipboard(newClip, self) {
      navigator.clipboard.writeText(newClip).then(function() {
          /* clipboard successfully set */
          self.copyMessage = self.$i18n.t('message.copy.ok');
          self.showCopy = true;
          setTimeout(() => { self.showCopy = false; /* self.copyMessage='';*/}, 1000); 
        }, function() {
        /* clipboard write failed */
          self.copyMessage = self.$i18n.t('message.copy.error');
          self.showCopy = true;
          setTimeout(() => { self.showCopy = false; /* self.copyMessage='';*/}, 1000); 
      });
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
    ...mapGetters(['showClock','showBtnStart','flashAnimal','cartoonByID', 'canBackward']),
    snackbar: {
      get() {
        console.log(`snackbar get ${this.$store.state.snackbarMessage}`);
        return this.$store.state.snackbarMessage !== '';
      },
      set(value) {
        console.log(`snackbar set ${value}`);
        this.$store.commit('snackbarMessage', { value });
      },
    }, 
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
    top: -10px;
    right: 0px;
  } 
  .clock-my {
    position: absolute;
    bottom: -10px;
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
