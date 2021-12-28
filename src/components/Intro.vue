<template>
  <div class="text-left">
    <v-overlay opacity=0.7>
      <v-carousel v-model="model" height="80vh" cycle interval="18000">
        <v-fab-transition>
                <v-btn
                  v-show="$store.state.showIntro"
                  color="pink"
                  fab
                  small
                  class="v-btn--close"
                  @click="closeIntro()"

                >
                  <v-icon>{{mdiClose}}</v-icon>
                </v-btn>
         </v-fab-transition>
        <v-carousel-item
          v-for="(item, i) in items"
          :key="i"
        >
          <v-card
            color="blue lighten-4"
            light
            height="100%"
          >
                <v-card-title v-if="i===0"
                  class="text-h5"
                  v-text="$t('intro.title')"
                >
                </v-card-title>
                <v-card-subtitle v-if="item.subtitle" class="text-subtitle-2 py-0">
                  {{ $t(item.subtitle) }}
                </v-card-subtitle>
                <v-card-title
                  class="text-h6"
                  v-text="$t(item.title)"
                ></v-card-title>

                  <v-card-text>
                    <i18n :path="item.text" tag="p">
                      <template v-slot:lnbr><br></template>
                      <template v-slot:s_mdireload><v-icon>{{mdiReload}}</v-icon></template>
                      <template v-slot:s_mdimenu><v-icon>{{mdiMenu}}</v-icon></template>
                      <template v-slot:s_mdihelp><v-avatar color="pink lighten-3" size="24"><v-icon x-small>{{mdiHelp}}</v-icon></v-avatar></template>
                      <template v-slot:s_mdiarrange><v-icon>{{mdiArrangeBringForward}}</v-icon></template>
                      <template v-slot:s_mdislice><v-icon>{{mdiCircleSlice3}}</v-icon></template>
                      <template v-slot:s_mdivoice><v-icon>{{mdiAccountVoice}}</v-icon></template>
                    </i18n>
                  </v-card-text>
          </v-card>       
        </v-carousel-item>
      </v-carousel>
    </v-overlay>
  </div>
</template>

<script>

import { mdiClose,mdiReload,mdiArrangeBringForward,mdiHelp,mdiAccountVoice,mdiCircleSlice3,mdiMenu, } from '@mdi/js';
export default {
  name: 'Intro',
  data() {
    return {
      model: 0,
      mdiClose,
      mdiReload,
      mdiArrangeBringForward,
      mdiHelp,
      mdiAccountVoice,
      mdiCircleSlice3,
      mdiMenu,
      items: [
        {
          color: '#1F7087',
          src: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          title: "intro.t0", // 'KidsChess - это программа-тренажер',
          subtitle: "intro.s0",
          text:  "intro.text0", //`Основное назначение программы  - игровой тренинг борьбы фигур против пешек в отсутствии реальных спарринг-партнёров. 
                 //   Все игры имеют четыре уровня сложности. Некоторые игры предназначены исключительно для самых начинающих,
                 //   другие игры подойдут для более подготовленных шахматистов. И все игры легко
                 //   проводить на реальной доске в отсутствии гаджета.`,
        },
        {
          color: '#952175',
          src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
          title: "intro.t1", // 'Игровое поле',
          text: "intro.text1", //`Вы видите шахматную доску с начальной позицией последней сыгранной игры.
                //  Под доской указаны краткие правила данной игры. Нажав на значок ? (на розовом фоне) под доской, 
                //  можно увидеть назначение всех остальных кнопок и значков.`,
        },
        {
          color: '#952175',
          src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
          title: "intro.t2",// 'Как ходить',
          text:  "intro.text2"// `При нажатии на фигуру KidsChess показывает возможные ходы. Чтобы сходить, нажмине на фигуру, а потом на клетку, куда сходить.
                 //  Либо просто перетащите фигуру на эту клетку. Чтобы съесть, поставьте фигуру поверх съедаемой`,
        },
        {
          color: '#952175',
          src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
          title:  "intro.t3",// 'Назначения кнопок',
          text:  "intro.text3"//`МЕНЮ (слева вверху) – позволяет выбрать игру. В меню указаны Главы, в которых собраны
                // однотипные игры разной сложности. Нужно выбрать главу и затем выбрать игру.
                // ЦВЕТ ФИГУР (справа вверху)– программа позволяет тренироваться за обе стороны. Если вы выбрали
                // чёрные фигуры, нужно нажать на клавишу «НАЧАТЬ ИГРУ», находящуюся под доской.
                // НАЧАТЬ С НАЧАЛА (справа вверху) - начать эту игру с начала.
                // СИЛА ИГРЫ (в меню или слева над доской) – если вас не устраивать сила игры соперника можно подобрать более
                // подходящий уровень – имеется четыре уровня.
                // ОЗВУЧКА - под доской - программа проговаривает задания`,
        },
        {
          color: '#952175',
          src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
          title: "intro.t4",// 'Что еще в меню',
          text: "intro.text4"//`В МЕНЮ также имеются НАСТРОЙКИ , позволяющие
                //- отключить функцию перехаживания,
                //- настроить программу для игры вдвоём (хотя авторы настоятельно рекомендуют вдвоём
                //  играть лучше вживую, на реальной доске!)
                //  и другие, посмотрите`
        },
      ],
    };
  },
  methods: {
    closeIntro() {
      this.$store.commit('toggleIntro', { show: false });
    },

  },
};
</script>
<style scoped>
  /* This is for documentation purposes and will not be needed in your application */
  .v-btn--close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
  }
.v-card__title {
  word-break: normal!important;
}  
</style>