<template>
    <v-list class="pt-0"
         nav
         id="games"
    >
      <v-list-group
        v-for="task in tasksData"
        :key="task.title.en"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-avatar size="35" tile>
            <inline-svg :src="task.avatar"/>
          </v-list-item-avatar>
            
          <v-list-item-content>
            <v-list-item-title v-text="$i18n.t(task.title)"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon><v-icon size="18">{{complex(task.complex)}}</v-icon>
          </v-list-item-icon>
        </template>

        <v-list-item
          v-for="child in task.data"
          :key="child.id"
           @click="selectChild(child)" 
        >
          <v-list-item-content>
            <v-list-item-title v-text="$i18n.t(child.title)"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-list-item 
        :key="standardData.id"
        @click="selectChild(standardData)"   
      >
        <v-list-item-avatar size="35" tile>
          <inline-svg :src="standardData.avatar"/>
        </v-list-item-avatar>
        <v-list-item-content>
            <v-list-item-title v-text="$i18n.t(standardData.title)"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon><v-icon size="18">{{complex(standardData.complex)}}</v-icon>
          </v-list-item-icon>
          <v-list-item-icon>
          </v-list-item-icon>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-slider
          v-model="playLevel"
          thumb-label
          ticks
          :label="$t('menu.level')"
          :max= this.$store.state.engineDeep.length-1
          min=1
          :hint="getLevelHint"
          :persistent-hint="true"
          :disabled="twoPlayers"
        >
        </v-slider>
      </v-list-item >

      <v-list-group
        :prepend-icon=mdiCog
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>{{ $t('menu.settings') }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item dense>
          <v-list-item-action>
            <v-switch dense v-model="swBackMoves" :label="$t('menu.settings.noback')"  ></v-switch>
          </v-list-item-action>
        </v-list-item>
        <v-list-item dense>
          <v-list-item-action>
            <v-switch dense v-model="swTwoPlayers" :label="$t('menu.settings.two')" ></v-switch>
          </v-list-item-action>
        </v-list-item>
        <v-list-item dense>
          <v-list-item-action>
            <v-switch dense v-model="swStat" :label="$t('menu.settings.stat')" ></v-switch>
          </v-list-item-action>
        </v-list-item>

        <v-list-group
          sub-group
          no-action
        >
         <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ $t('menu.language') }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>{{mdiWeb}}</v-icon>
            </v-list-item-icon>
            <v-list-item-avatar size="24" tile>
              <img :src="getCurrentFlag" :alt="$t('menu.language')">
            </v-list-item-avatar>
          </template>

          <v-list-item
            v-for="([title, icon, id]) in languages"
            :key=id
            dense
            @click="selectLocale(id)"   
          >
            <v-list-item-title v-text="$i18n.t(title)"></v-list-item-title>
            <v-list-item-avatar size="24" tile>
              <img :src="`img/${icon}`" :alt="title">
            </v-list-item-avatar>
          </v-list-item>
        </v-list-group>  
              
      </v-list-group> 
      <v-list-item link :disabled="!swStat">
        <v-list-item-avatar tile size="24">
          <v-icon>
             {{mdiStarFace}}
          </v-icon>  
        </v-list-item-avatar>
        <v-list-item-content>
        <v-list-item-title @click="stats()">{{ $t('menu.achievements') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link>
        <v-list-item-avatar tile size="24">
          <v-icon>
             {{mdiCommentOutline}}
          </v-icon>  
        </v-list-item-avatar>
        <v-list-item-content>
        <v-list-item-title @click="intro()">{{ $t('menu.intro') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <AboutDlg />

      <v-list-item link>
        <v-list-item-avatar tile size="24">
          <v-icon>
             {{ mdiShareVariant }}
          </v-icon>  
        </v-list-item-avatar>
        <v-list-item-content>
        <v-list-item-title @click="share()">{{ $t('menu.share') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>    

</template>

<script>
import {  mapGetters } from 'vuex'; 
import AboutDlg from '@/components/AboutDlg'; 
// import ShareDlg from '@/components/ShareDlg'; 
import InlineSvg from 'vue-inline-svg';
import * as KidsConst from '@/lib/const.js';
import { Trans } from '@/plugins/Translation.js';
import * as Speech from '@/lib/speech.js';
import { mdiCog,mdiWeb,mdiCommentOutline,mdiStarFace,mdiShareVariant,mdiStarOutline,mdiStarHalfFull,mdiStar} from '@mdi/js';

let complexity = [mdiStarOutline,mdiStarHalfFull,mdiStar];

export default {
  name: 'Navi',
  components: {
    AboutDlg,
    // ShareDlg,    
    InlineSvg,
  },

  data: function() { // need "this" thus change from arrow function
    return {
      languages: [
        ['menu.language.auto', `${Trans.getUserSupportedLang()}24o.png`, KidsConst.AUTO],
        ['lang.en', 'en24o.png', 'en'],
        ['lang.ru', 'ru24o.png', 'ru'],
        ['lang.es', 'es24o.png', 'es'],
      ],
      mdiCog,
      mdiWeb,
      mdiCommentOutline,
      mdiStarFace,
      mdiShareVariant      
    }
  },

  methods: {
    selectChild(child) {
      this.$store.dispatch('workerSendNewGame');
      this.$store.commit('setChild', { child });
      this.$store.commit('toggleDrawer', { show: false });
      this.$store.commit('setGameActive', {value: false});
      this.$store.dispatch('flashAnimal');
      // this.drawer = false;
      localStorage.taskID = child.id;
    }, 
    selectLocale(lang) {
      let oldLocale = this.$i18n.locale; 
      if (lang !== this.$i18n.locale && lang !== KidsConst.AUTO) {
        this.$i18n.locale = lang;

        // this.$store.dispatch('onLangChange', {lang: this.$i18n.locale});
      }
      else if (lang === KidsConst.AUTO)  {
        let l = Trans.getUserSupportedLang();
        if (this.$i18n.locale !== l) {
          this.$i18n.locale = l;
          // this.$store.dispatch('onLangChange', {lang: this.$i18n.locale});
        }
      }
      if (oldLocale != this.$i18n.locale) {
        let speech = (Speech.voiceLanguage(this.$i18n.locale) != null);
        this.$store.commit('speechSupported', { value: speech });
        if (!speech)
          this.$store.commit('snackbarMessage', {value: this.$i18n.t('message.speech.nosupport',[this.$i18n.locale])});
      }
      localStorage.lang = lang;
      this.$store.commit('toggleDrawer', { show: false });
    },
    intro(){
      this.$store.commit('toggleDrawer', { show: false });
      this.$store.commit('toggleIntro', { show: true });
    },
    stats(){
      this.$store.commit('toggleDrawer', { show: false });
      this.$store.commit('toggleStats', { show: true });
    },
    share(){
      this.$store.commit('toggleDrawer', { show: false });
      this.$store.commit('toggleShare', { show: true });
    },
    
    complex(c) {
      return complexity[c];
    }
    

  },
  computed: {
    ...mapGetters(['tasksData','standardData','getLevelHint','showBtnStartGen','twoPlayers']),

    playLevel: {
      get () {
        return this.$store.state.engineLevel;
      },
      set (value) {
        if (this.$store.state.engineLevel !== value) {
          // console.log(`playLevel was :${this.$store.state.engineLevel} will bestate.engineDeep: ${value}  types ${typeof this.$store.state.engineLevel} ${typeof value}`); // eslint-disable-line no-console
          this.$store.commit('updateEngineLevel', {value});
          this.$store.dispatch('workerSendMistakeLevel');
          localStorage.playLevel = value;
        }

      }
    },
    swBackMoves: {
      get() { return this.$store.state.modeNoBackMoves; },
      set(value) { 
        this.$store.commit('backMoves', {value});
        localStorage.backMoves = value;
      }
    },
    swTwoPlayers: {
      get() { return this.twoPlayers; },
      set(value) { 
        this.$store.commit('twoPlayers', {value});
        localStorage.twoPlayers = value;
        if (this.showBtnStartGen) { // here we just check if we need to show, no mattter of game stage
          this.$store.commit('forcedBtnStart', {value: true});
        }
      }
    },
    // collect stat in db
    swStat: {
      get() { return this.$store.state.modeCollectStat; },
      set(value) { 
        this.$store.commit('collectStat', {value});
        localStorage.collectStat = value;
      }
    },
    getCurrentFlag() {
      return `img/${this.$i18n.locale}24o.png`;
    }


  },

  mounted() {
    /*if (localStorage.playLevel !== undefined && localStorage.playLevel >=1 && localStorage.playLevel <= this.$store.state.engineDeep.length-1) {
      this.playLevel = localStorage.playLevel;
    }*/
    if (localStorage.playLevel !== undefined) {
      let l = +localStorage.playLevel;
      if (l >=1 && l <= this.$store.state.engineDeep.length-1) 
        this.playLevel = +localStorage.playLevel;
    }

  }

}

</script>
<style>
#games .v-list-group .v-list-group__header .v-list-item__icon.v-list-group__header__append-icon {
  min-width: 24px!important;
  /* margin-left:0px;*/
}
</style>