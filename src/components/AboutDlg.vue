<template>
  <v-dialog v-model="dialog" max-width="400px">
    <template v-slot:activator="{ on }">
      <v-list-item link>
        <v-list-item-avatar tile>
          <v-icon>
             mdi-information-variant
          </v-icon>  
        </v-list-item-avatar>
        <v-list-item-content>
        <v-list-item-title v-on="on">{{ $t('menu.about') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title class="headline">{{ $t('menu.about') }}</v-card-title>
      <v-card-text><span class="body-1">{{ $t('menu.about.text') }}</span>
        <v-divider> </v-divider>
        <span v-html="$t('menu.about.used1')"></span><br />
        <span v-html="$t('menu.about.used2')"></span><br />
        <span v-html="$t('menu.about.used3')"></span><br />
        <span v-html="$t('menu.about.used4')"></span>
        <v-divider></v-divider>
        <span v-html="$t('menu.about.contact')"></span><br />
        {{ $t('menu.about.version') }} : {{$store.state.version}}<br />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
         <v-btn color="primary" text @click="closeDrawer">{{ $t('btn.close') }}</v-btn>
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
