<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title>Title</v-toolbar-title>

      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
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
          :key="child.fen"
        >
          <v-list-item-content>
            <v-list-item-title v-text="child.title.ru"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>    
    </v-navigation-drawer>    

    <v-main>
      <KidsArea :tasks="this.tasks"/>
      <TitleScreen v-if="isTitleShowing" v-on:title-screen-off="isTitleShowing=false"/>
    </v-main>
  </v-app>
</template>

<script>
import TitleScreen from './components/TitleScreen.vue';
import KidsArea from './components/KidsArea.vue';

export default {
  name: 'App',

  components: {
    TitleScreen,
    KidsArea,
  },

  data: () => ({
    isTitleShowing: true,
    drawer: false,
    //
  }),
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

};
</script>
