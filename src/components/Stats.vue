<template>
  <div class="text-left">
    <v-overlay opacity=0.7>
    <v-card class="basil px-2" 
      height="80vh"
      width="98vw"
      max-height="900"
      max-width="600"
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
      >
        <v-tab class="text-body-1">
          {{ $t('stats.stickers') }}
        </v-tab>
        <v-tab class="text-body-1">
          {{ $t('stats.games') }}
        </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" class="py-4 tabs-scroll overflow-auto">
      <v-tab-item class="py-2">
          <div v-if="stickersOk">
            <div v-for="(group, key) in byMonthStickers" :key="key">
              <div>{{ $t(datekey(key)) }} {{key.substring(0,4)}} </div>
              <template v-for="(item, index) in group">
                <Sticker :iconName="item.prize" :iconColor="item.color" :key="index" />
              </template>
            </div>            
          </div>
          <div v-else>
            {{ $t('stats.stickers') }}
        </div>


      </v-tab-item>
      <v-tab-item class="overflow-auto py-2">
          
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    {{ $t('stats.game_title') }}
                  </th>
                  <th class="text-left">
                    {{ $t('stats.ns') }}
                  </th>
                  <th class="text-left">
                    {{ $t('stats.nf') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in p_games"
                  :key="item.id"
                >
                  <td>{{ $t(item.title) }}</td>
                  <td>{{ item.nStarted }}</td>
                  <td>{{ item.nCompleted }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
      </v-tab-item>
    </v-tabs-items>
    </v-card>
    </v-overlay>
  </div>
</template>

<script>


import Sticker from './Sticker.vue';
import { mdiClose,mdiReload,mdiArrangeBringForward,mdiHelp,mdiAccountVoice,mdiCircleSlice3,mdiMenu, } from '@mdi/js';
export default {
  name: 'Stats',
  props: {
    p_stickers: Array,
    p_games: Array,
  },
  components: {
    Sticker,
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
      // stickers: [],
    };
  },
  methods: {
    closeStats() {
      this.$store.commit('toggleStats', { show: false });
    },
    datekey(key) {
      return `months.${key.substring(4)}`;
      // return this.$i18n.t(`months.${key.substring(4)}`);
    }

  },
  computed: {
    stickersOk () {
      console.log(`stickersOk ${this.p_stickers}`);
      return this.p_stickers && typeof this.p_stickers === 'object' && this.p_stickers.length > 0
    },
    /**
     * returns object groupped stickers by monthe, with keys like 'yyyym' or 'yyyymm' and values - arrays of stickers
     */
    byMonthStickers: function () {
      return this.p_stickers.reduce((pre, cur) => {
        let d = new Date(cur.dateIssued);
        let key = `${d.getFullYear()}${d.getMonth()}`;
        if (!( key in pre)) pre[key] = [];
        pre[key].push(cur);
        return pre;
      }, {})
     
    }
  }
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
.tabs-scroll {
  height: calc(80vh - 120px);
}
.overflow-auto {
  overflow-y: auto;
}
</style>