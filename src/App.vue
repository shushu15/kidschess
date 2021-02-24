<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> 

      <v-toolbar-title>{{$t('title.game')}} {{this.$store.getters.getCurrentTask.title.ru}}</v-toolbar-title>

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
    >

    <v-list
         nav
    >
      <v-list-group
        v-for="task in tasks"
        :key="task.title.en"
        v-model="task.active"
        :prepend-icon="task.action"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="task.title.ru"></v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="child in task.data"
          :key="child.service.id"
           @click="selectChild(child)" 
        >
          <v-list-item-content>
            <v-list-item-title v-text="child.title.ru"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-list-item 
        :key="standard.service.id"
        @click="selectChild(standard)"   
      >
        <v-list-item-content>
            <v-list-item-title v-text="standard.title.ru"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-slider
          v-model="playLevel"
          thumb-label
          ticks
          :label="$t('menu.level')"
          max=3
          min=1
        >
        </v-slider>
      </v-list-item >
        <AboutDlg />       
    </v-list>    
    </v-navigation-drawer>    

    <v-main>
      <KidsArea :tasks="this.tasks" :forced="this.forcedReload"/>
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

export default {
  name: 'App',

  components: {
    TitleScreen,
    KidsArea,
    AboutDlg,     
  },

  data: () => ({
    isTitleShowing: true,
    drawer: false,
    forcedReload: new Date(),
    // playLevel: 1,
    //
  }),
  methods: {
    selectChild(child) {
      this.$store.commit('setChild', { child });
      this.$store.commit('toggleDrawer', { show: false });
      this.$store.commit('setGameActive', {value: false});
      this.drawer = false;
    }, 
    actFlipBoard() {
      this.$store.commit('flipBoard');  
      this.$store.commit('setGameActive', {value: false});
    },
    actReload() {
      if (this.canReload())
        this.forcedReload = new Date();
    },
    isMyMove() {
      return  this.$store.getters.isMoveOf(this.$store.state.HUMAN);
    },
    canReload() {
      return this.isMyMove() || this.finishedGame;
    }
  },
  computed: {
    ...mapGetters(['flipToWhite','flipToBlack','reloadAllowed','finishedGame']),
    playLevel: {
      get () {
        return this.$store.state.engineLevel;
      },
      set (value) {
        this.$store.commit('updateEngineLevel', {value})
      }
    },
  },  
  created() {
    this.tasks = [
      { title: {ru: 'Одежда для короля', en: "King's clothes"},
        description: { ru: 'Цель игры: полное уничтожение пешек или безопасное достижение любой пешкой поля превращения', 
                      en: 'Цель игры: полное уничтожение пешек или безопасное достижение любой пешкой поля превращения.' 
                      },
        active: 0,                
        data: [
          { 
            title: {ru: 'Штаны для короля', en: 'Штаны для короля'},
            fen: '8/p6p/8/8/8/8/8/4K3 w - - 0 1',
            description: { ru: 'Пешки легко выигрывают', en: 'Пешки легко выигрывают' },
            orientation: 'white',
            service: {id: '1bdf210a-32b8-4112-89eb-596475f4e67a', active: false },
          },
          { 
            title: {ru: 'Бриджи для короля', en: 'Бриджи для короля'},
            fen: '8/1p4p1/8/8/8/8/8/4K3 w - - 0 1',
            description: { ru: 'Пешки должны выиграть', en: 'Пешки должны выиграть' },
            orientation: 'white',
            service: {id: '297853ad-fc48-4137-8eaf-127c52984eb9', active: false },
          },
          { 
            title: {ru: 'Шорты для короля', en: 'Шорты для короля'},
            fen: '8/2p2p2/8/8/8/8/8/4K3 w - - 0 1',
            description: { ru: 'Король должен выиграть', en: 'Король должен выиграть' },
            orientation: 'white',
            service: {id: '28ae8cd0-7895-474a-9baf-da2fdef8707c', active: false },
          },
          { 
            title: {ru: 'Трусы для короля', en: 'Трусы для короля'},
            fen: '8/3pp3/8/8/8/8/8/4K3 w - - 0 1',
            description: { ru: 'Король легко выигрывает', en: 'Король легко выигрывает' },
            orientation: 'white',
            service: {id: '38666cf2-b286-4005-80ef-20abbeae35e5', active: false },
          },
          { 
            title: {ru: 'Юбка для короля', en: 'Юбка для короля'},
            fen: '8/3ppp2/8/8/8/8/8/4K3 w - - 0 1',
            description: { ru: 'При точной игре пешки должны выигрывать. Самая сложная игра', en: 'При точной игре пешки должны выигрывать. Самая сложная игра' },
            orientation: 'white',
            service: {id: '250cb750-994e-429f-b392-a436e37edd83', active: false },
          },
        ]
      },

      { title: {ru: 'Волк и Козлята', en: "Wolf and Kids"},
        description: { ru: 'Цель игры: полное уничтожение (или блокирование) противника или безопасное превращение пешки', 
                      en: 'Цель игры: полное уничтожение (или блокирование) противника или безопасное превращение пешки' 
                      },
        active: 0,                
        data: [
          { 
            title: {ru: 'Три Козленка', en: 'Three Kids'},
            fen: '7r/8/8/8/8/8/3PPP2/8 w - - 0 1',
            description: { ru: 'Ладья против 3х связанных пешек. Ладья должна выигрывать', en: 'Ладья против 3х связанных пешек. Ладья должна выигрывать' },
            orientation: 'white',
            service: {id: '157ca1d8-09eb-45dc-9529-668bb5562fa7', active: false },
          },
          { 
            title: {ru: 'Змей Горыныч', en: 'Fire Dragon'},
            fen: '3q4/8/8/8/8/8/PPPPPPPP/8 w - - 0 1',
            description: { ru: 'Змей Горыныч с восьмью головами (пешками) пытается пролезть хотя бы одной головой в царский дворец (последняя горизонталь),  а Иван – Царевич (ферзь) должен не допустить этого и отрубить все головы Змея  Горыныча.',
                           en: 'Змей Горыныч с восьмью головами (пешками) пытается пролезть хотя бы одной головой в царский дворец (последняя горизонталь),  а Иван – Царевич (ферзь) должен не допустить этого и отрубить все головы Змея  Горыныча.' },
            orientation: 'white',
            service: {id: '0a336aca-77e1-4a12-8c35-f5771538a0b4', active: false },
          },
          { 
            title: {ru: 'Четыре Козленка', en: 'Four Kids'},
            fen: '3r4/8/8/8/8/8/2PPPP2/8 w - - 0 1',
            description: { ru: 'Волк должен победить', en: 'Волк должен победить' },
            orientation: 'white',
            service: {id: '21386bed-d3ed-4ee0-afd3-b59b6d7dd8cc', active: false },
          },
          { 
            title: {ru: 'Пять Козлят', en: 'Five Kids'},
            fen: '3r4/8/8/8/8/8/1PPPPP2/8 w - - 0 1',
            description: { ru: 'Шансы примерно равны', en: 'Шансы примерно равны' },
            orientation: 'white',
            service: {id: '50096326-6ea6-4c5b-b289-9b004a432df7', active: false },
          },
          { 
            title: {ru: 'Шесть Козлят', en: 'Six Kids'},
            fen: '3r4/8/8/8/8/8/1PPPPPP1/8 w - - 0 1',
            description: { ru: 'Козлята должны победить', en: 'Козлята должны победить' },
            orientation: 'white',
            service: {id: '29fb5320-b749-4c9e-b859-ba7f7ff37f1b', active: false },
          },
        ]
      },

      { title: {ru: 'Одежда для Слона', en: "Elephant clothes"},
        description: { ru: 'Цель игры: взаимное истребление или безопасное  достижение любой пешкой поля превращения. Белые начинают.', 
                      en: 'Цель игры: взаимное истребление или безопасное  достижение любой пешкой поля превращения. Белые начинают.' 
                      },
        active: 0,                
        data: [
          { 
            title: {ru: 'Плавки для Слона', en: 'Плавки для Слона'},
            fen: '8/3pp3/8/8/8/8/8/2B5 w - - 0 1',
            description: { ru: 'Белые должны выиграть', en: 'Белые должны выиграть' },
            orientation: 'white',
            service: {id: '8d243eac-f466-4472-9061-455c0a4e6b1e', active: false },
          },
          { 
            title: {ru: 'Плавки для Слона 2', en: 'Плавки для Слона 2'},
            fen: '8/3pp3/8/8/8/8/8/5B2 w - - 0 1',
            description: { ru: 'Белые должны выиграть', en: 'Белые должны выиграть' },
            orientation: 'white',
            service: {id: 'ca18abbf-ccff-4b69-8a7c-b000d8fa8bd1', active: false },
          },
          {
            title: {ru: 'Трусы для Слона', en: 'Трусы для Слона'},
            fen: '8/3p1p2/8/8/8/8/8/2B5 w - - 0 1',
            description: { ru: 'Белые легко выигрывают', en: 'Белые легко выигрывают' },
            orientation: 'white',
            service: {id: 'c805e418-ed0c-4589-be9f-4be622cdf9a7', active: false },
          },
          {
            title: {ru: 'Трусы для Слона 2', en: 'Трусы для Слона 2'},
            fen: '8/3p1p2/8/8/8/8/8/5B2 w - - 0 1',
            description: { ru: 'Белые легко выигрывают', en: 'Белые легко выигрывают' },
            orientation: 'white',
            service: {id: '6bf4def0-975f-4651-bc04-62fa0a371d34', active: false },
          },
          {
            title: {ru: 'Шорты для Слона', en: 'Шорты для Слона'},
            fen: '8/2p2p2/8/8/8/8/8/2B5 w - - 0 1',
            description: { ru: 'При игре без ошибок белые легко выигрывают', en: 'При игре без ошибок белые легко выигрывают' },
            orientation: 'white',
            service: {id: '2b414e79-9913-43ca-a813-41caca4209eb', active: false },
          },
          {
            title: {ru: 'Шорты для Слона 2', en: 'Шорты для Слона 2'},
            fen: '8/2p2p2/8/8/8/8/8/5B2 w - - 0 1',
            description: { ru: 'При игре без ошибок белые легко выигрывают', en: 'При игре без ошибок белые легко выигрывают' },
            orientation: 'white',
            service: {id: '6ef817b4-218c-4446-a22c-39aaa9458dd0', active: false },
          },
          {
            title: {ru: 'Бриджи для Слона', en: 'Бриджи для Слона'},
            fen: '8/1p4p1/8/8/8/8/8/2B5 w - - 0 1',
            description: { ru: 'При точной игре белые выигрывают', en: 'При точной игре белые выигрывают' },
            orientation: 'white',
            service: {id: 'c13703a7-e327-4aae-b366-70d76bcb4f57', active: false },
          },
          {
            title: {ru: 'Бриджи для Слона 2', en: 'Бриджи для Слона 2'},
            fen: '8/1p4p1/8/8/8/8/8/5B2 w - - 0 1',
            description: { ru: 'При точной игре белые выигрывают', en: 'При точной игре белые выигрывают' },
            orientation: 'white',
            service: {id: 'd20da7dc-39ef-40c1-b994-d50a32c5a02b', active: false },
          },
          {
            title: {ru: 'Штаны для Слона', en: 'Штаны для Слона'},
            fen: '8/p6p/8/8/8/8/8/2B5 w - - 0 1',
            description: { ru: 'При точной игре белые выигрывают', en: 'При точной игре белые выигрывают' },
            orientation: 'white',
            service: {id: 'b8c5216d-c40e-442a-8802-1248b43055a7', active: false },
          },
          {
            title: {ru: 'Штаны для Слона 2', en: 'Штаны для Слона 2'},
            fen: '8/p6p/8/8/8/8/8/5B2 w - - 0 1',
            description: { ru: 'При точной игре белые выигрывают', en: 'При точной игре белые выигрывают' },
            orientation: 'white',
            service: {id: '26072c3a-9ade-4f12-a2e9-2af86993a282', active: false },
          },
        ]
      },

      { title: {ru: 'Война', en: "War"},
        description: { ru: 'Цель игры – полное уничтожение противника или безопасное превращение пешки,  (т.е. так, чтобы соперник ответным ходом не уничтожил эту пешку)', 
                      en: 'Цель игры – полное уничтожение противника или безопасное превращение пешки,  (т.е. так, чтобы соперник ответным ходом не уничтожил эту пешку)', 
                      },
        active: 0,                
        data: [
          { 
            title: {ru: 'Битва', en: 'Битва'},
            fen: 'r7/ppp3p1/8/8/8/8/1P3PPP/7R w - - 0 1',
            description: { ru: '', en: '' },
            orientation: 'white',
            service: {id: '6d67f327-1788-4bd5-87bf-51844af7e5fa', active: false },
          },
          { 
            title: {ru: 'Битва 2', en: 'Битва 2'},
            fen: '7r/1p3ppp/8/8/8/8/PPP3P1/R7 w - - 0 1',
            description: { ru: '', en: '' },
            orientation: 'white',
            service: {id: '487b9798-6a0a-4da7-a46b-fbdbebd39704', active: false },
          },
          { 
            title: {ru: 'Сражение', en: 'Сражение'},
            fen: 'r1b5/ppp3p1/8/8/8/8/1P3PPP/5B1R w - - 0 1',
            description: { ru: '', en: '' },
            orientation: 'white',
            service: {id: 'f1351919-198f-420d-ae76-f2ff86de087b', active: false },
          },
          { 
            title: {ru: 'Сражение 2', en: 'Сражение 2'},
            fen: '5b1r/1p3ppp/8/8/8/8/PPP3P1/R1B5 w - - 0 1',
            description: { ru: '', en: '' },
            orientation: 'white',
            service: {id: '57e2aeb8-e0eb-48c9-8f55-d94f26229ce1', active: false },
          },
 
           { 
            title: {ru: 'Война', en: 'Война'},
            fen: 'r1b3n1/pppp2p1/8/8/8/8/1P2PPPP/1N3B1R w - - 0 1',
            description: { ru: '', en: '' },
            orientation: 'white',
            service: {id: 'd04cd230-5ce6-4374-8abb-571676f4e4ef', active: false },
          },
           { 
            title: {ru: 'Война 2', en: 'Война 2'},
            fen: '1n3b1r/1p2pppp/8/8/8/8/PPPP2P1/R1B3N1 w - - 0 1',
            description: { ru: '', en: '' },
            orientation: 'white',
            service: {id: '45bf6f3d-c0d4-4c0d-8d9d-21cfe079fc54', active: false },
          },

        ]
      },
    ];

    this.standard =  { 
      title: {ru: 'Шахматы', en: 'Chess'},
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      description: { ru: 'Просто шахматы', en: 'Chess game' },
      orientation: 'white',
      service: {id: '118ccf0b-9c1e-4129-a6db-929b36010a02', active: false },
    },

    this.$store.commit('setChild', { child: this.tasks[0].data[0] });
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
    }
    // END WORKER
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
