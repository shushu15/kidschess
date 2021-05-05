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
              :id='getCurrentTask.id' :forced="this.forced" @on-orientation="flippedBoard" @on-speak="speakGame" />
         <label class="thinking-opp caption glow" v-show="showClock('b') && longThinking">{{$t('message.thinking')}}</label>     
         <span class="ai-level">
          <v-badge
            bottom
            overlap
            right
            color="pink lighten-3"
            :content="$t('help.level')"
            :value="this.$store.state.showHelp && !twoPlayers"
          >
          <label class="caption" v-show="!twoPlayers"  @click="changeLevel" :aria-label="$t('btn.level')">{{getLevelHint}}</label> 
          <v-icon v-show="!twoPlayers"  @click="changeLevel" :aria-label="$t('btn.level')">
            {{ getChartLevel() }}
          </v-icon>
          </v-badge>
        </span>
         <div class="clock-opp"><v-icon v-bind:class="{glow: !finishedGame && gameActive}" v-show="showClock('b')">
            {{ mdiAlarm }}
        </v-icon></div>     
         <div class="clock-my"><v-icon v-bind:class="{glow: !finishedGame && gameActive}" v-show="showClock('w')">
            {{ mdiAlarm }}
        </v-icon></div>
         <label class="thinking-my caption" v-show="showClock('w')" v-bind:class="{glow: !finishedGame}">{{$t('message.yourmove')}}</label>     
         </div>  
      </v-col>
    </v-row>
    <v-row class="ma-0 pa-0">
      <v-col class="d-flex justify-center ma-0 pa-0" cols="12">
        <v-badge
          bottom
          overlap
          left
          offset-x="40px"
          color="pink lighten-3"
          :content="$t('help.moveback')"
          :value="this.$store.state.showHelp"
        >
          <v-btn  icon  class="mx-4" color="blue" @click="actBackward" :disabled="!canBackward" :aria-label="$t('btn.moveback')">
            <v-icon>{{mdiStepBackward}}</v-icon>
          </v-btn> 
        </v-badge>  
        <v-tooltip v-model="showCopy" top :open-on-hover="false" :open-on-click="false" >
          <template v-slot:activator="{ on, attrs }">
            <v-badge
              top
              overlap
              left
              color="pink lighten-3"
              offset-x="120px"
              :content="$t('help.copygame')"
              :value="$store.state.showHelp"
            >
              <v-btn icon class="ml-4" color="blue" @click="actInfo"  v-bind="attrs" v-on="on" :aria-label="$t('btn.copygame')">
                <v-icon>{{ mdiContentCopy }}</v-icon>
              </v-btn> 
            </v-badge>  
          </template>
          <span>{{this.copyMessage}}</span>
        </v-tooltip>
        <label class="caption align-self-center fixw mr-4">{{textLastMove}}</label>
        <v-badge
          bottom
          overlap
          left
          color="pink lighten-3"
          offset-x="40px"
          :content="$t('help.speech')"
          :value="this.$store.state.showHelp && speechSupported"
        >
          <v-btn  icon  class="mx-4" color="blue" @click="actSpeech" v-show="speechSupported" :aria-label="$t('btn.speech')">
            <v-icon>{{$store.state.modeSpeech? mdiAccountVoice:mdiVoiceOff }}</v-icon>         
          </v-btn> 
        </v-badge>  
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
            {{$t(getCurrentTask.description)}}        
        </div>
        <div class="text-subtitle-2" v-if="currentParent != undefined">
            {{$t(currentParent.description)}}        
        </div>
 
      </v-col>

    </v-row>
    <v-btn
      @click="actHelp"
      color="pink lighten-3"
      fab
      x-small
      bottom
      right
      absolute
      :disabled="this.$store.state.showHelp"
      :aria-label="$t('btn.help.ui')"
    >
      <v-icon x-small>{{ mdiHelp }}</v-icon>
    </v-btn>
   <v-snackbar
      v-model="snackbar"
      :timeout="6000"
      :color="sb_color"
      :class="{movedown : snackbar}"
    >
      <v-avatar class="float-left"  tile>
        <inline-svg :src="cartoonByID(getCurrentTask.id,getCurrentTask.orientation)" />
      </v-avatar>
      {{this.$store.state.snackbar.message}}

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
import * as Speech from '@/lib/speech.js';
import { mdiAlarm,mdiStepBackward,mdiHelp,mdiContentCopy,mdiAccountVoice,mdiVoiceOff,mdiCircleSlice1,mdiCircleSlice3,mdiCircleSlice5,mdiCircleSlice8 } from '@mdi/js';



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
      mdiAlarm,
      mdiStepBackward,
      mdiHelp,
      mdiContentCopy,
      mdiAccountVoice,
      mdiVoiceOff,
      mdiCircleSlice1,
      mdiCircleSlice3,
      mdiCircleSlice5,
      mdiCircleSlice8
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
          let s = `${this.$i18n.t(this.$store.getters.getCurrentTask.title)}\n${this.$store.getters.getCurrentTask.orientation}\n${this.$store.getters.getCurrentTask.fen}\n${this.$refs.wrkBoard.getHistory().join(' ')}`;
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
    actSpeech () { 
        this.$store.commit('modeSpeech');
        localStorage.speechAllow = this.$store.state.modeSpeech;
        if (this.$store.state.modeSpeech) { // switched to allowed - say
          this.speakGame();
        } else {
          Speech.clear();
        }
    },
    speakGame(say) {
      if (this.$store.state.modeSpeech && this.$store.state.speechSupported) {
        if (say !== undefined) {
          Speech.talk(say, this.$i18n.locale);
        } else {
          Speech.clear();
          Speech.talk(`${this.$i18n.t('title.game')} ${this.$i18n.t(this.$store.getters.getCurrentTask.title)}.`, this.$i18n.locale);
          let s1 = this.$i18n.t(this.$store.getters.getCurrentTask.description).trim();
          if (s1.length > 0)
            Speech.talk(s1, this.$i18n.locale);
          if (this.currentParent != undefined ) {
            let s2 = this.$i18n.t(this.currentParent.description).trim();
            if (s2.length > 0) { // split string on .
              let arr = s2.split('.');
              arr.forEach((el) => {
                if(el.trim().length > 0)
                  Speech.talk(el, this.$i18n.locale);
              });

              // Speech.talk(s2, this.$i18n.locale);
            }
          }
        }
      }
    },
    getChartLevel() {
      switch(this.getLevel) {
        case 1: return this.mdiCircleSlice1;
        case 2: return this.mdiCircleSlice3;
        case 3: return this.mdiCircleSlice5;
        default: return this.mdiCircleSlice8;
      }
    },
    changeLevel() {
      let newLevel = this.getLevel + 1;
      if (newLevel > this.$store.state.engineDeep.length-1) newLevel = 1;
      this.$store.commit('updateEngineLevel', {value: newLevel});
      this.$store.dispatch('workerSendMistakeLevel');
      localStorage.playLevel = newLevel;
    },
    //demoOnScreen() {
    //  return !this.$store.state.isTitleShowing && this.$store.state.isDemo;
    //},
    actHelp () { 
        this.$store.dispatch('showHelp');
    },


    /**
     * Helper method to reduse typing
     */
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
              'currentParent','textLastMove','longThinking','twoPlayers','getLevelHint','speechSupported','getLevel']),
    snackbar: {
      get() {
        //console.log(`snackbar get ${this.$store.state.snackbarMessage}`);
        return this.$store.state.snackbar.message !== '';
      },
      set(value) {
        //console.log(`snackbar set ${value}`);
        this.$store.commit('snackbarMessage', { value });
      },
    },
    
    sb_color() {
      return this.$store.state.snackbar.type===KidsConst.TYPE_POSITIVE? '#4D9546':
          this.$store.state.snackbar.type===KidsConst.TYPE_NEGATIVE?  '#95464F': "blue-grey";
      //return this.$store.state.snackbar.type===KidsConst.TYPE_POSITIVE? 'snackbar_pos':
      //    this.$store.state.snackbar.type===KidsConst.TYPE_NEGATIVE?  'snackbar_pos': "";
    }, 
 
  },
  
    
  mounted() {
    // WORKER
    let myTask;
    if (window.Worker && this.$store.state.webWorkerAI === undefined) {
     // myTask = new QueryableWorker(); // './workers/Task.worker.js');
    // url MUST be a hard-coded string for worker-plugin - in the other case the file would not be found in runtime in webpack bundle

     myTask = new Worker('../lib/ai/lozza/lozza.js', { type: 'module' });
     // myTask = new Worker('./lib/ai/js-chess-engine/js-chess-worker.js', { type: 'module' });
     // myTask = new Worker('./lib/ai/lozza/lozza.js');

      myTask.onmessage = (event) => {
        // console.log(`App  onmessage event ${event} data ${event.data} origin ${event.origin} source ${event.source}`); // eslint-disable-line no-console
        this.$store.dispatch('workerReply', { message: event.data  }); 
      };

      this.$store.commit('setWorkerAI', { worker: myTask });
      //this.$store.dispatch('workerSendMistakeLevel'); 
    }
    // END WORKER
    this.$store.dispatch('startDemo');
    this.$store.dispatch('workerSendNewGame');
    this.$refs.wrkBoard.initialMove();

    // Speech.preferredLanguage(this.$i18n.locale);
    // let _self = this;
    Speech.init(this.$i18n.locale).then( (res) => {
      this.$store.commit('speechSupported', { value: res });
      if (!res) {
        this.$store.commit('snackbarMessage', {value: this.$i18n.t('message.speech.nosupport',[this.$i18n.locale])});
      } else {
        setTimeout(() => { this.speakGame(); }, 5000); 
      }

    }
    );


  },
 //   created() {
//       this.$store.commit('setChild', { child: this.tasks[0].data[0] });
 //     this.reloadTask();      
  //  } 

  }
</script>

<style scoped>
/* TO make it working remove "scoped"
 .v-badge .v-badge__badge {
  font-size: 14px !important;
  height: 22px !important;
} 
**/

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
  .ai-level {
    position: absolute;
    top: -10px;
    left: 0px;
  } 
  .clock-my {
    position: absolute;
    bottom: -10px;
    right:  0px;
  } 
  .thinking-my {
    position: absolute;
    bottom: -10px;
    right: 30px;
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
		color: hsl(199, 95%, 45%);
    transform:scale(1);
	}
	50% {
		color: hsl(199, 100%, 26%);
    transform:scale(1.1);
	}
	100% {
		color: #313131;
    transform:scale(1);
	}
} 
.movedown {
  animation-name: movedown;
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
}
 @keyframes movedown { 
  0% { transform: translateY(-50vh);  }
  20% { transform: translateY(-50vh);  }
  100% {  transform: translateY(0);  } 
 }

 /*
  .snackbar_neg {
    background: linear-gradient(to bottom right, #BF360C, 10%, #607D8B);
  }
  .snackbar_pos {
    background: linear-gradient(to bottom right, #1B5E20, 10%, #607D8B);
  } */

</style> 
