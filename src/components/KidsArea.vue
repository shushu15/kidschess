<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1 class="display-2 font-weight-bold mb-3">
           {{this.currentTask.title}}   
        </h1>
      </v-col>

      <v-col class="mb-4">
        <KidsBoard ref="wrkBoard" :fen='currentTask.fen' :orientation='currentTask.orientation' />
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
            {{this.currentTask.description}}        
        </h2>
        <button class="button is-light" v-for="task in tasks"  @click="loadTask(task)" :key="task.fen + task.orientation">
            {{task.title}}
        </button>

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

  data () {
    return {
      currentFen: '',
      positionInfo: null,
      currentTask: {}      
    }
  },
  methods: {
    showInfo(data) {
      this.positionInfo = data
    },
    loadFen(fen) {
      this.currentFen = fen
    },
    loadTask(task) {
      this.currentTask = task;
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
  created() {
    this.tasks = [
      { title: {ru: 'Одежда для короля', en: "King's clothes"},
        description: { ru: 'Цель игры: полное уничтожение пешек или безопасное достижение любой пешкой поля превращения', 
                      en: 'Цель игры: полное уничтожение пешек или безопасное достижение любой пешкой поля превращения.' 
                      },
        data: [
          { 
            title: {ru: 'Штаны для короля', en: 'Штаны для короля'},
            fen: '8/p6p/8/8/8/8/8/4K3 w - - 0 1',
            description: { ru: 'Пешки легко выигрывают', en: 'Пешки легко выигрывают' },
            orientation: 'white',
          },
          { 
            title: {ru: 'Бриджи для короля', en: 'Бриджи для короля'},
            fen: '8/1p4p1/8/8/8/8/8/4K3 w - - 0 1',
            description: { ru: 'Пешки должны выиграть', en: 'Пешки должны выиграть' },
            orientation: 'white',
          },
          { 
            title: {ru: 'Шорты для короля', en: 'Шорты для короля'},
            fen: '8/2p2p2/8/8/8/8/8/4K3 w - - 0 1',
            description: { ru: 'Король должен выиграть', en: 'Король должен выиграть' },
            orientation: 'white',
          },
          { 
            title: {ru: 'Трусы для короля', en: 'Трусы для короля'},
            fen: '8/3pp3/8/8/8/8/8/4K3 w - - 0 1',
            description: { ru: 'Король легко выигрывает', en: 'Король легко выигрывает' },
            orientation: 'white',
          },
          { 
            title: {ru: 'Юбка для короля', en: 'Юбка для короля'},
            fen: '8/3ppp2/8/8/8/8/8/4K3 w - - 0 1',
            description: { ru: 'При точной игре пешки должны выигрывать. Самая сложная игра', en: 'При точной игре пешки должны выигрывать. Самая сложная игра' },
            orientation: 'white',
          },
        ]
      },

      { title: {ru: 'Волк и Козлята', en: "Wolf and Kids"},
        description: { ru: 'Цель игры: полное уничтожение (или блокирование) противника или безопасное превращение пешки', 
                      en: 'Цель игры: полное уничтожение (или блокирование) противника или безопасное превращение пешки' 
                      },
        data: [
          { 
            title: {ru: 'Три Козленка', en: 'Three Kids'},
            fen: '7r/8/8/8/8/8/3PPP2/8 w - - 0 1',
            description: { ru: 'Ладья против 3х связанных пешек. Ладья должна выигрывать', en: 'Ладья против 3х связанных пешек. Ладья должна выигрывать' },
            orientation: 'white',
          },
          { 
            title: {ru: 'Змей Горыныч', en: 'Fire Dragon'},
            fen: '3q4/8/8/8/8/8/PPPPPPPP/8 w - - 0 1',
            description: { ru: 'Змей Горыныч с восьмью головами (пешками) пытается пролезть хотя бы одной головой в царский дворец (последняя горизонталь),  а Иван – Царевич (ферзь) должен не допустить этого и отрубить все головы Змея  Горыныча.',
                           en: 'Змей Горыныч с восьмью головами (пешками) пытается пролезть хотя бы одной головой в царский дворец (последняя горизонталь),  а Иван – Царевич (ферзь) должен не допустить этого и отрубить все головы Змея  Горыныча.' },
            orientation: 'white',
          },
          { 
            title: {ru: 'Четыре Козленка', en: 'Four Kids'},
            fen: '3r4/8/8/8/8/8/2PPPP2/8 w - - 0 1',
            description: { ru: 'Волк должен победить', en: 'Волк должен победить' },
            orientation: 'white',
          },
          { 
            title: {ru: 'Пять Козлят', en: 'Five Kids'},
            fen: '3r4/8/8/8/8/8/1PPPPP2/8 w - - 0 1',
            description: { ru: 'Шансы примерно равны', en: 'Шансы примерно равны' },
            orientation: 'white',
          },
          { 
            title: {ru: 'Шесть Козлят', en: 'Six Kids'},
            fen: '3r4/8/8/8/8/8/1PPPPPP1/8 w - - 0 1',
            description: { ru: 'Козлята должны победить', en: 'Козлята должны победить' },
            orientation: 'white',
          },
        ]
      },

      { title: {ru: 'Одежда для Слона', en: "Elephant clothes"},
        description: { ru: 'Цель игры: взаимное истребление или безопасное  достижение любой пешкой поля превращения. Белые начинают.', 
                      en: 'Цель игры: взаимное истребление или безопасное  достижение любой пешкой поля превращения. Белые начинают.' 
                      },
        data: [
          { 
            title: {ru: 'Плавки для Слона', en: 'Плавки для Слона'},
            fen: '8/3pp3/8/8/8/8/8/2B5 w - - 0 1',
            description: { ru: 'Белые должны выиграть', en: 'Белые должны выиграть' },
            orientation: 'white',
          },
          { 
            title: {ru: 'Плавки для Слона', en: 'Плавки для Слона'},
            fen: '8/3pp3/8/8/8/8/8/5B2 w - - 0 1',
            description: { ru: 'Белые должны выиграть', en: 'Белые должны выиграть' },
            orientation: 'white',
          },
          {
            title: {ru: 'Трусы для Слона', en: 'Трусы для Слона'},
            fen: '8/3p1p2/8/8/8/8/8/2B5 w - - 0 1',
            description: { ru: 'Белые легко выигрывают', en: 'Белые легко выигрывают' },
            orientation: 'white',
          },
          {
            title: {ru: 'Трусы для Слона', en: 'Трусы для Слона'},
            fen: '8/3p1p2/8/8/8/8/8/5B2 w - - 0 1',
            description: { ru: 'Белые легко выигрывают', en: 'Белые легко выигрывают' },
            orientation: 'white',
          },
          {
            title: {ru: 'Шорты для Слона', en: 'Шорты для Слона'},
            fen: '8/2p2p2/8/8/8/8/8/2B5 w - - 0 1',
            description: { ru: 'При игре без ошибок белые легко выигрывают', en: 'При игре без ошибок белые легко выигрывают' },
            orientation: 'white',
          },
          {
            title: {ru: 'Шорты для Слона', en: 'Шорты для Слона'},
            fen: '8/2p2p2/8/8/8/8/8/5B2 w - - 0 1',
            description: { ru: 'При игре без ошибок белые легко выигрывают', en: 'При игре без ошибок белые легко выигрывают' },
            orientation: 'white',
          },
          {
            title: {ru: 'Бриджи для Слона', en: 'Бриджи для Слона'},
            fen: '8/1p4p1/8/8/8/8/8/2B5 w - - 0 1',
            description: { ru: 'При точной игре белые выигрывают', en: 'При точной игре белые выигрывают' },
            orientation: 'white',
          },
          {
            title: {ru: 'Бриджи для Слона', en: 'Бриджи для Слона'},
            fen: '8/1p4p1/8/8/8/8/8/5B2 w - - 0 1',
            description: { ru: 'При точной игре белые выигрывают', en: 'При точной игре белые выигрывают' },
            orientation: 'white',
          },
          {
            title: {ru: 'Штаны для Слона', en: 'Штаны для Слона'},
            fen: '8/p6p/8/8/8/8/8/2B5 w - - 0 1',
            description: { ru: 'При точной игре белые выигрывают', en: 'При точной игре белые выигрывают' },
            orientation: 'white',
          },
          {
            title: {ru: 'Штаны для Слона', en: 'Штаны для Слона'},
            fen: '8/p6p/8/8/8/8/8/5B2 w - - 0 1',
            description: { ru: 'При точной игре белые выигрывают', en: 'При точной игре белые выигрывают' },
            orientation: 'white',
          },
        ]
      },

      { title: {ru: 'Война', en: "War"},
        description: { ru: 'Цель игры – полное уничтожение противника или безопасное превращение пешки,  (т.е. так, чтобы соперник ответным ходом не уничтожил эту пешку)', 
                      en: 'Цель игры – полное уничтожение противника или безопасное превращение пешки,  (т.е. так, чтобы соперник ответным ходом не уничтожил эту пешку)', 
                      },
        data: [
          { 
            title: {ru: 'Битва', en: 'Битва'},
            fen: 'r7/ppp3p1/8/8/8/8/1P3PPP/7R w - - 0 1',
            description: { ru: '', en: '' },
            orientation: 'white',
          },
          { 
            title: {ru: 'Битва', en: 'Битва'},
            fen: '7r/1p3ppp/8/8/8/8/PPP3P1/R7 w - - 0 1',
            description: { ru: '', en: '' },
            orientation: 'white',
          },
          { 
            title: {ru: 'Сражение', en: 'Сражение'},
            fen: 'r1b5/ppp3p1/8/8/8/8/1P3PPP/5B1R w - - 0 1',
            description: { ru: '', en: '' },
            orientation: 'white',
          },
          { 
            title: {ru: 'Сражение', en: 'Сражение'},
            fen: '5b1r/1p3ppp/8/8/8/8/PPP3P1/R1B5 w - - 0 1',
            description: { ru: '', en: '' },
            orientation: 'white',
          },
 
           { 
            title: {ru: 'Война', en: 'Война'},
            fen: 'r1b3n1/pppp2p1/8/8/8/8/1P2PPPP/1N3B1R w - - 0 1',
            description: { ru: '', en: '' },
            orientation: 'white',
          },
           { 
            title: {ru: 'Война', en: 'Война'},
            fen: '1n3b1rr/1p2pppp/8/8/8/8/PPPP2P1/R1B3N1 w - - 0 1',
            description: { ru: '', en: '' },
            orientation: 'white',
          },

        ]
      },
    ];
  },
   mounted() {
    this.loadTask(this.tasks[0]);             
  }    
  }
</script>
