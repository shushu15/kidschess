<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> 

      <v-toolbar-title>{{$t('title.game')}} {{this.$store.getters.getCurrentTask.title[$i18n.locale]}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon v-if="reloadAllowed" @click="actReload" :disabled="!canReload()">mdi-reload</v-icon>
        <v-icon v-if="flipToBlack" @click="actFlipBoard">mdi-arrange-send-backward</v-icon>
        <v-icon v-if="flipToWhite" @click="actFlipBoard">mdi-arrange-bring-forward</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      width="310"
    >

    <v-list
         nav
    >
      <v-list-group
        v-for="task in tasksData"
        :key="task.title.en"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-avatar size="35">
            <inline-svg :src="task.avatar"/>
          </v-list-item-avatar>
            
          <v-list-item-content>
            <v-list-item-title v-text="task.title[$i18n.locale]"></v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="child in task.data"
          :key="child.id"
           @click="selectChild(child)" 
        >
          <v-list-item-content>
            <v-list-item-title v-text="child.title[$i18n.locale]"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-list-item 
        :key="standardData.id"
        @click="selectChild(standardData)"   
      >
        <v-list-item-avatar size="35">
          <inline-svg :src="standardData.avatar"/>
        </v-list-item-avatar>
        <v-list-item-content>
            <v-list-item-title v-text="standardData.title[$i18n.locale]"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-slider
          v-model="playLevel"
          thumb-label
          ticks
          :label="$t('menu.level')"
          :max= "this.$store.state.engineDeep.length-1"
          min=1
          :hint="getLevelHint"
          :persistent-hint="true"
        >
        </v-slider>
      </v-list-item >
        <AboutDlg />       
    </v-list>    
    </v-navigation-drawer>    

    <v-main>
      <!-- KidsArea :tasks="this.tasks" :forced="this.forcedReload"/ -->
      <KidsArea :forced="this.forcedReload"/>
      <TitleScreen  v-if="$store.state.isTitleShowing"/>
    </v-main>
  </v-app>
</template>

<script>
import {  mapGetters } from 'vuex'; 
// import QueryableWorker from '@/lib/QueryableWorker'; 
import TitleScreen from './components/TitleScreen.vue';
import KidsArea from './components/KidsArea.vue';
import AboutDlg from '@/components/AboutDlg'; 
import InlineSvg from 'vue-inline-svg';


export default {
  name: 'App',

  components: {
    TitleScreen,
    KidsArea,
    AboutDlg,
    InlineSvg,
  },

  data: () => ({
    isTitleShowing: true,
    // drawer: false,
    forcedReload: new Date(),
    // playLevel: 1,
    //
  }),
  methods: {
    selectChild(child) {
      this.$store.dispatch('workerSendNewGame');
      this.$store.commit('setChild', { child });
      this.$store.commit('toggleDrawer', { show: false });
      this.$store.commit('setGameActive', {value: false});
      this.$store.dispatch('flashAnimal');
      this.drawer = false;
      localStorage.taskID = child.id;
    }, 
    actFlipBoard() {
      this.$store.commit('flipBoard');  
      this.$store.commit('setGameActive', {value: false});
      // clear history if flipped to ROBOT
      if (!this.isMyMove())
        this.$store.commit('setHistoryFen');  // no paraneters - clear history
    },
    actReload() {
      if (this.canReload()) {
        this.$store.dispatch('workerSendNewGame');
        this.forcedReload = new Date();
      }
    },
    isMyMove() {
      return  this.$store.getters.isMoveOf(this.$store.state.HUMAN);
    },
    canReload() {
      return this.isMyMove() || this.finishedGame;
    },

  },
  computed: {
    ...mapGetters(['flipToWhite','flipToBlack','reloadAllowed','finishedGame', 'tasksData','standardData','childByID','getLevelHint']),
    playLevel: {
      get () {
        return this.$store.state.engineLevel;
      },
      set (value) {
        this.$store.commit('updateEngineLevel', {value});
        this.$store.dispatch('workerSendMistakeLevel');
        localStorage.playLevel = value;

      }
    },
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
    // WORKER
    let myTask;
    if (window.Worker) {
     // myTask = new QueryableWorker(); // './workers/Task.worker.js');
    // url MUST be a hard-coded string for worker-plugin - in the other case the file would not be found in runtime in webpack bundle

     myTask = new Worker('./lib/ai/lozza/lozza.js', { type: 'module' });
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
    if (localStorage.playLevel !== undefined && localStorage.playLevel >=1 && localStorage.playLevel <= this.$store.state.engineDeep.length-1) {
      this.playLevel = localStorage.playLevel;
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

