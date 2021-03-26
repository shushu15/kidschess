<template>
  <v-container class="kidsarea">
    <div class="cartoon">
    <transition name="sliding">
      <inline-svg v-if="flashAnimal"  :src="cartoonByID(getCurrentTask.id, getCurrentTask.orientation)" width="100" height="100" class="anim" />
    </transition> 
    </div>
    <v-row class="text-center">

      <v-col class="d-flex justify-center" cols="12">
        <div class="layer1 pa-4 ma-0 rounded-lg">       
        <KidsBoard ref="wrkBoard" :fen='getCurrentTask.fen' :orientation='getCurrentTask.orientation' 
              :id='getCurrentTask.id' :forced="this.forced" @on-orientation="flippedBoard"/>
         <label class="thinking-opp caption glow" v-show="showClock('b') && longThinking">{{$t('message.thinking')}}</label>     
         <div class="clock-opp"><v-icon v-bind:class="{glow: !finishedGame && gameActive}" v-show="showClock('b')">
            mdi-alarm
        </v-icon></div>     
         <div class="clock-my"><v-icon v-bind:class="{glow: !finishedGame && gameActive}" v-show="showClock('w')">
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
        <label class="caption align-self-center fixw">{{textLastMove}}</label>
       </v-col> 
    </v-row>
    <v-row class="text-center">
      <v-col cols="12" class="ma-0 pa-0">
        <v-fade-transition v-if="showBtnStart">
          <div >
            <v-btn v-if="showBtnStart" rounded color="primary"  @click="bntGameStart">{{ $store.state.history.moves.length>0? $t('btn.game.continue') : $t('btn.game.start') }}</v-btn>
           </div>
         </v-fade-transition>     
      </v-col>
    </v-row>  
    <v-row class="text-center">
      <v-col
        cols="12"
      >
        <div class="text-subtitle-1">
            {{getCurrentTask.description[$i18n.locale]}}        
        </div>
        <div class="text-subtitle-2" v-if="currentParent != undefined">
            {{currentParent.description[$i18n.locale]}}        
        </div>
      </v-col>

    </v-row>
    <v-snackbar
      v-model="snackbar"
      :timeout="6000"
      color="blue-grey"
    >
      <v-avatar class="float-left" tile>
        <inline-svg :src="cartoonByID(getCurrentTask.id,getCurrentTask.orientation)" />
      </v-avatar>
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
import * as KidsConst from '@/lib/const.js';


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
      this.$store.commit('forcedBtnStart', {value: false});
      this.$refs.wrkBoard.aiNextMove();
    },
    flippedBoard() {
      this.$store.commit('forcedBtnStart', {value: false});
      if (this.$store.getters.isMoveOf(KidsConst.HUMAN)) {
        this.$refs.wrkBoard.initialMove();
      }
    }, 
    actBackward() {
      if (this.$store.state.history.moves.length > (this.twoPlayers? 0: 1) ) { // at last 2 half-moves
        // this.$store.commit('actBackward');  
        this.$refs.wrkBoard.actBackward();
      }
    },
    actInfo() {
      let self = this;
      navigator.permissions.query({name: "clipboard-write"}).then(result => {
        if (result.state == "granted" || result.state == "prompt") {
          /* write to the clipboard now */
          let s = `${this.$store.getters.getCurrentTask.title[this.$i18n.locale]}\n${this.$store.getters.getCurrentTask.orientation}\n${this.$store.getters.getCurrentTask.fen}\n${this.$refs.wrkBoard.getHistory().join(' ')}`;
          console.log(s); // eslint-disable-line no-console 
          this.updateClipboard(s, self);
          
        }
      });
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
    promote() {
      if (confirm("Want to promote to rook? Queen by default") ) {
        return 'r'
      } else {
        return 'q'
      }
    } */
  }, 
     computed: {
    ...mapGetters(['showClock','showBtnStart','flashAnimal','cartoonByID', 'canBackward','getCurrentTask','finishedGame', 'gameActive', 
              'currentParent','textLastMove','longThinking','twoPlayers']),
    snackbar: {
      get() {
        //console.log(`snackbar get ${this.$store.state.snackbarMessage}`);
        return this.$store.state.snackbarMessage !== '';
      },
      set(value) {
        //console.log(`snackbar set ${value}`);
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
  .fixw {
    width: 80px;
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
  .thinking-opp {
    position: absolute;
    top: -10px;
    right: 60px;
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
.glow {
  animation-name: glowicon;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
} 
@keyframes glowicon {
	0% {
		color: hsl(199, 73%, 63%);
	}
	50% {
		color: hsl(199, 88%, 33%);
	}
	100% {
		color: #313131;
	}
} 


</style> 
