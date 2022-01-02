<template>
      <transition name="fade">
        <v-card class="title-screen">
          <v-card-text>
              <div class="d-flex justify-center text-center text-h6">{{ $t('title.2') }}</div>
          </v-card-text>  
          <v-card-title  class="text-center text-h5" style="font-weight: 500;" color="primary" >
              {{ $t('title.kids') }}
          </v-card-title>
          <v-card-text>
              <div class="d-flex justify-center text-center body-1">{{ $t('title.1') }}</div>
          </v-card-text>
          <v-card-actions>
               <v-btn color="primary" class="btn-up" text @click="skipSplash">{{ $t('btn.skipsplash') }}</v-btn>
          </v-card-actions>  
          <div class="animals ms-0">
          <transition-group name="sliding" tag="div" class="animaline align-content-space-between">
                <div :key="4" v-if="this.animalsList.includes(4)" class="align-self-end"><inline-svg  :src="require('../assets/img/029-goat.svg')"  width="50" height="50" /></div>
                <div :key="2" v-if="this.animalsList.includes(2)" class="align-self-end"><inline-svg  :src="require('../assets/img/029-goat.svg')"  width="50" height="50" /></div>
                <div :key="1" v-if="this.animalsList.includes(1)" class="align-self-end"><inline-svg  :src="require('../assets/img/098-wolf.svg')"  width="100" height="100" /></div>
                <div :key="3" v-if="this.animalsList.includes(3)" class="align-self-end"><inline-svg  :src="require('../assets/img/029-goat.svg')"  width="50" height="50" /></div>
                <div :key="5"  v-if="this.animalsList.includes(5)" class="align-self-end"><inline-svg :src="require('../assets/img/029-goat.svg')"  width="50" height="50" /></div>
          </transition-group> 
          <transition-group name="sliding" tag="div" class="animaline align-content-space-between">
                <div :key="6"  v-if="this.animalsList.includes(6)" class="align-self-end"><inline-svg :src="require('../assets/img/046-lion.svg')"  width="110" height="100" /></div>
                <div :key="7"  v-if="this.animalsList.includes(7)" class="align-self-end"><inline-svg :src="require('../assets/img/022-elephant.svg')"  width="120" height="120" /></div>
          </transition-group> 
          </div>
        </v-card>
      </transition>
</template>

<script>
import InlineSvg from 'vue-inline-svg';

let titleTimer = null;
let readyTimer = null;

export default {
  name: 'TitleScreen',

  components: {
      InlineSvg,
  },
  data () {
    return {
      animalsList: [],
    }
  },
  methods: {
    skipSplash() {
    // console.log("skipSplash Pressed"); // eslint-disable-line no-console
      clearTimeout(readyTimer);
       this.$store.commit('readyScreen');
      clearTimeout(titleTimer);
      this.offTitle();
    },
    offTitle() {
      // console.log("offTitle"); // eslint-disable-line no-console
      this.$store.commit('hideTitleScreen'); 
      if (this.$store.getters.twoPlayers) {
        this.$store.commit('snackbarMessage', {value: this.$i18n.t('message.board.two_players')});
      }
    }
  },

  mounted() {
    this.animalsList.splice(0);
    titleTimer = setTimeout(() => { this.offTitle();
                  }, 5000); 
    for (let i=1; i<8; i++) {
      setTimeout(() => { this.animalsList.push(i) }, 50*i); 
    }
    // we force loading to show main screen in background - hidden
    readyTimer = setTimeout(() => { this.$store.commit('readyScreen'); }, 2000); 
  },
};
</script>

<style scoped>
.btn-up {
  z-index: 202;
}
.title-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: calc(100vh - 64px);
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  border: 0;
  transition: all 0.2s;
  z-index: 200;
}

.animals {
  z-index: 201;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content:space-between;
  flex-direction:column;
}
.animaline {
    display: flex;
    justify-content: space-between
}
/*
.fade2 {
  border: 0;
  height: 200px;
  width: 400px;
}
*/
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-leave-active {
  transition: opacity 1.5s ease;
}

.sliding-enter-active {
  animation: sliding 1.5s;
}
/*
.sliding-leave-active {
  animation: sliding 1.5s reverse;
}*/

@keyframes sliding {
  0% {
    transform: translateY(500vh);
  }
  100% {
    transform: translateY(0);
  } 
}

.v-card__title, .v-card__title {
  word-break: normal!important;
} 



</style>
