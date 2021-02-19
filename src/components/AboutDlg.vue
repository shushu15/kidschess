<template>
  <v-dialog v-model="dialog" max-width="400px">
    <template v-slot:activator="{ on }">
      <v-list-item link>
        <v-list-item-content>
        <v-spacer> </v-spacer>
        <v-list-item-title v-on="on">{{ $t('menu.about') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title class="headline">{{ $t('menu.about') }}</v-card-title>
      <v-card-text>{{ $t('menu.about.text') }}
        <v-spacer></v-spacer>
        {{ $t('menu.about.used') }}
        <v-spacer></v-spacer>
        {{ $t('menu.about.contact') }}
        {{ $t('menu.about.version') }} : {{$store.state.version}}<br />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
         <v-btn color="primary" text @click="closeDrawer()">{{ $t('btn.close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
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
