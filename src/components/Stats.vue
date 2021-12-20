<template>
  <div class="text-left">
    <v-overlay opacity=0.7>
    <v-card class="basil" 
      height="80vh"
      light
    >
              <v-fab-transition>
                <v-btn
                  v-show="$store.state.showStats"
                  color="pink"
                  fab
                  small
                  class="v-btn--close"
                  @click="closeStats()"
                >
                  <v-icon>{{mdiClose}}</v-icon>
                </v-btn>
         </v-fab-transition>
<v-card-title class="text-center justify-center py-4 text-h5" color="primary">
        {{ $t('menu.achievements') }}
    </v-card-title>         
      <v-tabs
        v-model="tab"
        background-color="transparent"
        grow
      >
        <v-tab class="text-body-1">
          {{ $t('stats.stickers') }}
        </v-tab>
        <v-tab class="text-body-1">
          {{ $t('stats.games') }}
        </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card
          flat
          height="100%"
        >
          <v-card-text>
          <div v-if="this.stickersOk()">
            Список стикеров
          </div>
          <div v-else>
            Стикеры пока что не получены
        </div>


          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card
          flat
          height="100%"
        >
          <v-card-text>{{ $t('intro.text1') }}</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
    </v-card>
    </v-overlay>
  </div>
</template>

<script>

import { mdiClose,mdiReload,mdiArrangeBringForward,mdiHelp,mdiAccountVoice,mdiCircleSlice3,mdiMenu, } from '@mdi/js';
export default {
  name: 'Stats',
  props: {
    p_stickers: Array,
    p_games: Array,
  },
  data() {
    return {
      tab: null,
      mdiClose,
      mdiReload,
      mdiArrangeBringForward,
      mdiHelp,
      mdiAccountVoice,
      mdiCircleSlice3,
      mdiMenu,
      stickers: [],
    };
  },
  methods: {
    closeStats() {
      this.$store.commit('toggleStats', { show: false });
    },
    stickersOk () {
      console.log(`stickersOk ${this.p_stickers}`);
      return this.p_stickers && typeof(this.p_stickers) == Object && this.s_stickers.length > 0
    }

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

.basil {
  background-color: white !important;
}
</style>