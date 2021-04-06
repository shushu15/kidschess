<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="clickMenu()" :disabled="$store.state.isTitleShowing" :aria-label="$t('btn.menu')" :class="{glowbox: this.$store.state.isDemo}"></v-app-bar-nav-icon> 

      <v-toolbar-title>{{$store.state.isTitleShowing? $t('title.ready'): `${$t('title.game')} ${$t(this.$store.getters.getCurrentTask.title)}`}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon v-if="reloadAllowed" @click="actReload" :disabled="!canReload()" :aria-label="$t('btn.repeat')">{{mdiReload}}</v-icon>
        <v-icon v-if="flipToBlack" @click="actFlipBoard" :disabled="$store.state.isTitleShowing" :aria-label="$t('btn.switch_color')" :class="{glowbox: this.$store.state.isDemo}">{{mdiArrangeSendBackward}}</v-icon>
        <v-icon v-if="flipToWhite" @click="actFlipBoard" :disabled="$store.state.isTitleShowing" :aria-label="$t('btn.switch_color')" :class="{glowbox: this.$store.state.isDemo}">{{mdiArrangeBringForward}}</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      temporary
      width="310"
      app
    >
      <Navi v-if="!$store.state.isTitleShowing"/>

    </v-navigation-drawer>    

    <v-main class="main-screen">
      <KidsArea v-if="!$store.state.isTitleShowing" :forced="this.forcedReload"/>
      <TitleScreen  v-if="$store.state.isTitleShowing"/>
    </v-main>
  </v-app>
</template>

<script>
import {  mapGetters } from 'vuex'; 
import TitleScreen from './components/TitleScreen.vue';
// import KidsArea from './components/KidsArea.vue';
//const KidsArea = () => import(/* webpackChunkName: "kidsarea" */ './components/KidsArea.vue');
import * as KidsConst from '@/lib/const.js';
// import { Trans } from '@/plugins/Translation.js';
import { mdiReload,mdiArrangeSendBackward,mdiArrangeBringForward } from '@mdi/js';




export default {
  name: 'App',

  components: {
    TitleScreen,
    // KidsArea,
    KidsArea: () => import(/* webpackChunkName: "kidsarea" */ './components/KidsArea.vue'),
    Navi: () => import(/* webpackChunkName: "navi" */ './components/Navi.vue'),
  },

  data: function() { // need "this" thus change from arrow function
    return {
    // isTitleShowing: true,
      forcedReload: new Date(),

      mdiReload,
      mdiArrangeSendBackward,
      mdiArrangeBringForward,
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
  }, 
  
  created() {

    let childTo = undefined;
    if (localStorage.taskID !== undefined) 
    {
      childTo = this.childByID(localStorage.taskID)
      //console.log(`childTo=${JSON.stringify(childTo)}`);

    }
    if (childTo === undefined) childTo = this.tasksData[0].data[0]; //this.tasks[0].data[0];
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
</style>

