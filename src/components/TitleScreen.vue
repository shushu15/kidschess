<template>
      <transition name="fade">
  <v-row>
    <v-col cols="12" sm="6" offset-sm="3">
        <v-card class="title-screen">
          <v-card-title primary-title  color="primary">
            <div>
              <h1 class="display-3 mb-0">Шахматные игры для детей</h1>
              <div>Обучение игры в шахматы для самых маленьких</div>
            </div>
          </v-card-title>
        </v-card>
     </v-col>
   </v-row>
      </transition>
</template>

<script>

export default {
  mounted() {
    // setTimeout(() => { this.$root.isTitleShowing = false; }, 2000);
    setTimeout(() => { this.$emit('title-screen-off'); }, 2000);
  },
};
</script>

<style lang="scss" scoped>
.title-screen {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
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
</style>
