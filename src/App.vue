<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-badge
        bottom
        overlap
        right
        color="pink lighten-3"
        :content="$t('help.mainmenu')"
        :value="this.$store.state.showHelp"
      >
        <v-app-bar-nav-icon @click.stop="clickMenu()" :disabled="$store.state.isTitleShowing" :aria-label="$t('btn.menu')" :class="{glowbox: this.$store.state.isDemo}"></v-app-bar-nav-icon> 
      </v-badge>
        <v-toolbar-title>{{$store.state.isTitleShowing? $t('title.ready'): `${$t('title.game')} ${$t(this.$store.getters.getCurrentTask.title)}`}}</v-toolbar-title>

        <v-spacer></v-spacer>

      <v-badge
        top
        overlap
        left
        offset-x="40px"
        color="pink lighten-3"
        :content="reloadAllowed? $t('help.reload'): $t('help.changepieces')"
        :value="this.$store.state.showHelp"
      >
        <v-btn icon>
          <v-icon v-if="reloadAllowed" @click="actReload" :disabled="!canReload()" :aria-label="$t('btn.repeat')">{{mdiReload}}</v-icon>
          <v-icon v-if="flipToBlack" @click="actFlipBoard" :disabled="$store.state.isTitleShowing" :aria-label="$t('btn.switch_color')" :class="{glowbox: this.$store.state.isDemo}">{{mdiArrangeSendBackward}}</v-icon>
          <v-icon v-if="flipToWhite" @click="actFlipBoard" :disabled="$store.state.isTitleShowing" :aria-label="$t('btn.switch_color')" :class="{glowbox: this.$store.state.isDemo}">{{mdiArrangeBringForward}}</v-icon>
        </v-btn>
      </v-badge>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      temporary
      width="310"
      app
    >
      <v-btn
        class="ma-1"
        plain
        @click.stop="clickMenu()"
      >
        <v-icon>{{mdiKeyboardBackspace}}</v-icon>
      </v-btn> 
      <Navi v-if="!$store.state.isTitleShowing"/>

    </v-navigation-drawer>    

    <v-main class="main-screen">
      <KidsArea v-if="screenReady()" :forced="this.forcedReload" :class="{loadhidden: screenReadyHidden()}"/>
      <TitleScreen  v-if="$store.state.isTitleShowing"/>
      <Intro v-if="$store.state.showIntro" />
      <Stats v-if="$store.state.showStats" :p_stickers="getStickers()" :p_games="getGames()"/>
      <ShareDlg v-if="$store.state.showShare" />
      <transition name="slide-from-left">
      <v-btn v-if="this.$store.state.lastPrize" rounded color="primary"  @click="bntPrizes"  class="btn-prizes slide-from-left" :style="this.cssProps()"><v-avatar color="white" size="32">
          <Sticker :iconName="this.$store.state.lastPrize.prize" :iconColor="this.$store.state.lastPrize.color" :size=32 class="float-left" />
        </v-avatar>{{$t('btn.stickers')}}
      </v-btn>
     </transition>

    </v-main>
  </v-app>
</template>

<script>
import {  mapGetters } from 'vuex'; 
import TimerMixin from '@/mixins/TimerMixin.js'; 
import TitleScreen from './components/TitleScreen.vue';
// import KidsArea from './components/KidsArea.vue';
//const KidsArea = () => import(/* webpackChunkName: "kidsarea" */ './components/KidsArea.vue');
import * as KidsConst from '@/lib/const.js';
// import { Trans } from '@/plugins/Translation.js';
import { mdiReload,mdiArrangeSendBackward,mdiArrangeBringForward,mdiKeyboardBackspace } from '@mdi/js';
// import * as DB from '@/lib/db.js';



export default {
  name: 'App',
  mixins: [TimerMixin], 
  components: {
    TitleScreen,
    // KidsArea,
    KidsArea: () => import(/* webpackChunkName: "kidsarea", webpackPrefetch: true */ './components/KidsArea.vue'),
    Navi: () => import(/* webpackChunkName: "navi", webpackPrefetch: true */ './components/Navi.vue'),
    Intro: () => import(/* webpackChunkName: "intro", webpackPrefetch: true */ './components/Intro.vue'),
    Stats: () => import(/* webpackChunkName: "stats", webpackPrefetch: true */ './components/Stats.vue'),
    ShareDlg: () => import(/* webpackChunkName: "share", webpackPrefetch: true */ './components/ShareDlg.vue'),
    Sticker: () => import(/* webpackChunkName: "sticker", webpackPrefetch: true */ './components/Sticker.vue'),

  },

  data: function() { // need "this" thus change from arrow function
    return {
    // isTitleShowing: true,
      forcedReload: new Date(),
      mdiReload,
      mdiArrangeSendBackward,
      mdiArrangeBringForward,
      mdiKeyboardBackspace,
    //
    }
  },
  methods: {
    actFlipBoard() {
      this.$store.commit('flipBoard');  
      this.$store.commit('setGameActive', {value: false});
      this.$store.dispatch('flashAnimal');
      // clear history if flipped to ROBOT
      //if (!this.isMyMove())
      //  this.$store.commit('setHistoryFen');  // no paraneters - clear history
      this.$store.commit('addMove');  // no paraneters - clear history
    },
    actReload() {
      if (this.canReload()) {
        this.$store.dispatch('workerSendNewGame');
        this.forcedReload = new Date();
        this.$store.dispatch('flashAnimal');
      }
    },
    isMyMove() {
      return  this.$store.getters.isMoveOf(KidsConst.HUMAN);
    },
    canReload() {
      return this.isMyMove() || this.finishedGame || this.twoPlayers;
    },
    needFlipPieces () {
      return true;
    },
    clickMenu() {
      if(!this.$store.state.isTitleShowing)
        this.drawer = !this.drawer;
    },
    screenReady() {
      return !this.$store.state.isTitleShowing || this.$store.state.isScreenReady;
    },
    screenReadyHidden() {
      return this.$store.state.isTitleShowing && this.$store.state.isScreenReady;
    },
    getStickers() {
      // need to return cached data
      return this.$store.state.dbCache.stickers;
    },
    getGames() {
      // need to return cached data
      return this.$store.state.dbCache.games;
    },
    bntPrizes() {
      this.$store.commit('setLastPrize', { value: undefined});
      this.$store.commit('toggleStats', { show: true });
    },
    // interface for TimerMixin 
    emitEvent(name, e) {
      if (name === 'timer-idle') {
        // console.log(`emitEvent in App: e.idle=${e.idle/1000}s e.uptime=${e.uptime/1000}s`); // eslint-disable-line no-console
        // not less then 10 lauches, 10 min from game start, 1 month from the last show
        if ((e.uptime > KidsConst.SHARE_SHOW_TIMER)  && (+localStorage.launch_num >= 10)) {
          if (!localStorage.share_shown || (localStorage.share_shown && Date.now() - localStorage.share_shown > KidsConst.REMIND_SHARE)) {
            localStorage.share_shown = Date.now();
            this.$store.commit('toggleShare', { show: true });
          }
        }
        // testing   button 
        /*
            setTimeout( () => {
              let prize = this.$store.state.dbCache.stickers.length > 0 && this.$store.state.dbCache.stickers[0] ? 
                this.$store.state.dbCache.stickers[0]:
                        {color: "light-blue",
                          dateIssued: 1640560420416,
                          gameID: "322c7b6a-4323-4993-8f07-b063e15ac775",
                          prize: "mdiFlower"};
              console.log(`prize Button ${prize}`); // eslint-disable-line no-console
              this.$store.commit('setLastPrize', {value: prize});
             setTimeout( () => {
                this.$store.commit('setLastPrize', {value: undefined});
              }, 10000);
            }, 15000);
        */
        // end testing
        // testing   database
        /*
        let d = this.$store.state.tasks[DB.getRandomInt(this.$store.state.tasks.length)].data;
        let id = d[DB.getRandomInt(d.length)].id;
        let issued = new Date(2021, DB.getRandomInt(12), DB.getRandomInt(30)).valueOf(); 
        DB.forcePrize(id, issued);
        console.log(`emitEvent for gameID=${id} issued=${issued}`); // eslint-disable-line no-console
        */
        // end testing database
        
      }
    }, 
    cssProps() {
      return {
        top: `${window.innerHeight + window.scrollY - 110}px`,
      }
    }
    
  },
  computed: {
    ...mapGetters(['flipToWhite','flipToBlack','reloadAllowed','finishedGame', 'tasksData','childByID','twoPlayers']),
    drawer: {
      get() {
        return this.$store.state.showDrawer;
      },
      set(value) {
        this.$store.commit('toggleDrawer', { show: value });
      }, 
    },
    /*
    cssProps() {
      return {
        top: `${window.innerHeight - 110}px`,
      }
    }
*/
  }, 
  
  created() {

    let childTo = undefined;
    if (localStorage.taskID !== undefined) 
    {
      childTo = this.childByID(localStorage.taskID)
      //console.log(`childTo=${JSON.stringify(childTo)}`);

    }
    if (childTo === undefined) childTo = this.tasksData[1].data[3]; // Wolf and 5 Kids
    //console.log(`childTo.id=${childTo.id}`);
    this.$store.commit('setChild', { child:  childTo});
    this.$store.commit('setGameActive', {value: false});
   },

  mounted() {
    if (localStorage.lang !== undefined && localStorage.lang !== KidsConst.AUTO) {
      this.$i18n.locale = localStorage.lang;
    }
    // NOTE, that localStorage keeps all as strings
    if (localStorage.backMoves !== undefined) {
      this.$store.commit('backMoves', {value: localStorage.backMoves == 'true'});
    } 
    if (localStorage.twoPlayers !== undefined) {
      this.$store.commit('twoPlayers', {value: localStorage.twoPlayers == 'true'});
    } 
    if (localStorage.speechAllow !== undefined && localStorage.speechAllow !== 'undefined') {
      this.$store.commit('modeSpeech', {value: localStorage.speechAllow == 'true'});
    } 
    if (localStorage.launch_num === undefined) localStorage.launch_num = 1;
    else localStorage.launch_num = +localStorage.launch_num+1;
    if (localStorage.collectStat !== undefined) {
      this.$store.commit('collectStat', {value: localStorage.collectStat == 'true'});
    } 


  },     
  beforeDestroy() {
    // WORKER
    if (this.$store.state.webWorkerAI !== undefined) {
      this.$store.state.webWorkerAI.terminate();
      this.$store.commit('setWorkerAI', { worker: undefined });
    }
  }

};
</script>
<style scoped>

.main-screen {
  position: relative;
}
.loadhidden {
  display: none;
}

.glowbox {
  animation: grow 1s ease-in-out 1s 5 alternate;
  box-shadow: 0 0 10px #ffff00;
}
  @keyframes grow
  {
    0%, 100%
    {
      transform:scale(1);
    }
    50%{
       transform:scale(1.2);
    }
  }
 .btn-prizes {
    position: absolute;
/*    bottom: 64px; */
/*    top: var('--top-a'); */
    left: 5px;
  } 
/*  
@media screen and (max-height: 700px) {   
   .btn-prizes {
      bottom: 36px;
   }
}
*/
.slide-from-left-enter-active, .slide-from-left-leave-active{
  transition: all 2s ease-in-out; /* what transition-property changed on moveing? */
}
.slide-from-left-enter, .slide-from-left-leave-to
{
  transform: translateX(-100vw);
}
/*
 @keyframes slide-from-left { 
  0% { transform: translateX(-100vh);  }
  100% {  transform: translateY(0);  } 
 }
 */


</style>

