<template>
      <transition name="fade">
  <v-row>
    <v-col cols="12" justify-center>
        <v-card class="title-screen">
          <v-card-text>
              <div class="d-flex justify-center text-center"><h2>{{ $t('title.2') }}</h2></div>
          </v-card-text>  
          <v-card-title  class="text-center" color="primary" >
              <h2>{{ $t('title.kids') }}</h2>
          </v-card-title>
          <v-card-text>
              <div class="d-flex justify-center text-center body-1">{{ $t('title.1') }}</div>
          </v-card-text> 
          <div class="animals mr-0">
          <transition-group name="sliding" tag="div" class="animaline">
                <inline-svg v-if="this.animalsList.includes(4)" :src="require('../assets/img/029-goat.svg')" :key="4" width="50" height="50" />
                <inline-svg v-if="this.animalsList.includes(2)" :src="require('../assets/img/029-goat.svg')" :key="2" width="50" height="50" />
                <inline-svg v-if="this.animalsList.includes(1)" :src="require('../assets/img/098-wolf.svg')" :key="1" width="100" height="100" />
                <inline-svg v-if="this.animalsList.includes(3)" :src="require('../assets/img/029-goat.svg')" :key="3" width="50" height="50" />
                <inline-svg v-if="this.animalsList.includes(5)" :src="require('../assets/img/029-goat.svg')" :key="5" width="50" height="50" />
          </transition-group> 
          <transition-group name="sliding" tag="div" class="animaline">
                <inline-svg v-if="this.animalsList.includes(6)" :src="require('../assets/img/046-lion.svg')" :key="6" width="110" height="100" />
                <inline-svg v-if="this.animalsList.includes(7)" :src="require('../assets/img/022-elephant.svg')" :key="7" width="120" height="120" />
          </transition-group> 
          </div>
        </v-card>
     </v-col>
   </v-row>
      </transition>
</template>

<script>
import InlineSvg from 'vue-inline-svg';

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

  mounted() {
    
    setTimeout(() => { this.$store.commit('hideTitleScreen'); }, 5000); 
    for (let i=1; i<8; i++) {
      setTimeout(() => { this.animalsList.push(i) }, 200*i); 
    }
  },
};
</script>

<style lang="scss" scoped>
.title-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  border: 0;
 // font-size: 5rem;
 // font-weight: 100;
 // letter-spacing: 0.5rem;
  transition: all 0.2s;
  z-index: 200;
  // background: $secondary-color;
  //background: radial-gradient(#333 0,  #eee 100%), url("../assets/cribbage-title.jpg");
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

.fade2 {
  border: 0;
  height: 200px;
  width: 400px;
  // box-shadow: 0 0 20px 20px #444, inset 0 0 10px 20px #444;
  // background: url("../assets/cribbage-title.jpg") no-repeat center, transparent radial-gradient(#333 0,  #eee 100%);
  // background: radial-gradient(transparent 0, transparent 50%, var(--outer-color) 90%), url("../assets/cribbage-title.jpg") no-repeat center;

}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-leave-active {
  transition: opacity 1.5s ease;
}

.sliding-enter-active {
  animation: sliding 1.5s;
}
.sliding-leave-active {
  animation: sliding 1.5s reverse;
}
/*
.sliding-enter, .sliding-leave-to
  transform: translateY(200px);
  opacity: 0;
} */

@keyframes sliding {
  0% {
    transform: translateY(500vh);
  }
  100% {
    transform: translateY(0);
  } 
}

</style>
