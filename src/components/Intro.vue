<template>
  <div class="text-center">
    <v-overlay :value="overlay">
      <v-carousel v-model="model">
        <v-carousel-item
          v-for="(item, i) in items"
          :key="i"
        >
          <v-card
            :color="item.color"
            dark
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="text-h5"
                  v-text="item.title"
                ></v-card-title>

                <v-card-subtitle v-text="item.text"></v-card-subtitle>

                <v-card-actions>
                  <v-btn
                    v-if="item.artist === 'Ellie Goulding'"
                    class="ml-2 mt-3"
                    fab
                    icon
                    height="40px"
                    right
                    width="40px"
                  >
                    <v-icon>mdi-play</v-icon>
                  </v-btn>

                  <v-btn
                    v-else
                    class="ml-2 mt-5"
                    outlined
                    rounded
                    small
                  >
                    START RADIO
                  </v-btn>
                </v-card-actions>
              </div>

              <v-avatar
                class="ma-3"
                size="125"
                tile
              >
                <v-img :src="item.src"></v-img>
              </v-avatar>
            </div>
          </v-card>       
        </v-carousel-item>
      </v-carousel>
    </v-overlay>
  </div>
</template>

<script>
import { mdiInformationVariant } from '@mdi/js';

export default {
  name: 'Intro',
  data() {
    return {
      dialog: false,
      mdiInformationVariant,
      items: [
        {
          color: '#1F7087',
          src: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          title: 'KidsChess - это программа-тренажер',
          text: `Основное назначение программы  - игровой тренинг борьбы фигур против пешек в отсутствии реальных спарринг-партнёров. 
                    Все игры имеют четыре уровня сложности. Некоторые игры предназначены исключительно для самых начинающих,
                    другие игры подойдут для более подготовленных шахматистов. И все игры легко
                    проводить на реальной доске в отсутствии гаджета.`,
        },
        {
          color: '#952175',
          src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
          title: 'Игровое поле',
          text: `Вы видите шахматную доску с начальной позицией последней сыгранной игры.
                  Под доской указаны краткие правила данной игры. Нажав на значок ? (на розовом фоне) под доской, 
                  можно увидеть назначение всех остальных кнопок и значков.`,
        },
        {
          color: '#952175',
          src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
          title: 'Как ходить',
          text: `При нажатии на фигуру KidsChess показывает возможные ходы. Чтобы сходить, нажмине на фигуру, а потом на клетку, куда сходить.
                  Либо просто перетащите фигуру на эту клетку. Чтобы съесть, поставьте фигуру поверх съедаемой`,
        },
        {
          color: '#952175',
          src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
          title: 'Назначения кнопок',
          text: `МЕНЮ (слева вверху) – позволяет выбрать игру. В меню указаны Главы, в которых собраны
                однотипные игры разной сложности. Нужно выбрать главу и затем выбрать игру.
                ЦВЕТ ФИГУР (справа вверху)– программа позволяет тренироваться за обе стороны. Если вы выбрали
                чёрные фигуры, нужно нажать на клавишу «НАЧАТЬ ИГРУ», находящуюся под доской.
                НАЧАТЬ С НАЧАЛА (справа вверху) - начать эту игру с начала.
                СИЛА ИГРЫ (в меню или слева над доской) – если вас не устраивать сила игры соперника можно подобрать более
                подходящий уровень – имеется четыре уровня.
                ОЗВУЧКА - под доской - программа проговаривает задания`,
        },
        {
          color: '#952175',
          src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
          title: 'Что еще в меню',
          text: `В МЕНЮ также имеются НАСТРОЙКИ , позволяющие
                - отключить функцию перехаживания,
                - настроить программу для игры вдвоём (хотя авторы настоятельно рекомендуют вдвоём
                  играть лучше вживую, на реальной доске!)
                  и другие, посмотрите`
        },
      ],
    };
  },
  methods: {
    closeDrawer() {
      this.dialog = false;
      this.$store.commit('toggleDrawer', { show: false });
    },
  },
};
</script>
