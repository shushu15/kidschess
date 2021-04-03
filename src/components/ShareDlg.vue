<template>
  <v-dialog v-model="dialog" max-width="400px">
    <template v-slot:activator="{ on }">
      <v-list-item link>
        <v-list-item-avatar tile size="35">
          <v-icon>
             {{ mdiShareVariant }}
          </v-icon>  
        </v-list-item-avatar>
        <v-list-item-content>

        <v-list-item-title v-on="on">{{$t('menu.share')}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title class="headline">{{$t('share.head')}}</v-card-title>
      <v-card-text class="share-network-list">
      <ShareNetwork
        v-for="network in networks"
        :network="network.network"
        :key="network.network"
        :style="{backgroundColor: network.color}"
        :url="sharing.url"
        :title="sharing.title"
        :description="sharing.description"
        :quote="sharing.quote"
        :hashtags="sharing.hashtags"
        :twitterUser="sharing.twitterUser"
      >
      <v-icon dark>{{network.icon}} </v-icon>
        <span> {{ network.name }}</span>
      </ShareNetwork>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
         <v-btn color="primary" text @click="closeDrawer">{{ $t('btn.close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// import ShareNetwork from 'vue-social-sharing';
// import ShareNetwork from '@/lib/vendor/share/vue-social-sharing.vue';
import { mdiFacebook,mdiLinkedin,mdiFacebookMessenger,mdiOdnoklassniki,mdiPinterest,mdiQuora,mdiReddit,
        mdiSkype,mdiTelegram,mdiTwitter,mdiVk,mdiWhatsapp,mdiShareVariant } from '@mdi/js';
import ShareNetwork from '@/lib/vendor/share/share-network.js';
export default {
  name: 'ShareDlg',
  components: {
    ShareNetwork,  
  },

  data() {
    return {
      dialog: false,
      sharing: {
        url: 'https://ownlinks.com/kidschess/',
        title: this.$i18n.t('share.title'),
        description: this.$i18n.t('share.description'),
        quote: this.$i18n.t('share.quote'),
        hashtags: this.$i18n.t('share.hashtags'),
        twitterUser: '',
        media: 'https://ownlinks.com/kidschess/img/icon/ms-icon-144x144.png'
      },
      networks: [
        { network: 'facebook', name: 'Facebook', icon: mdiFacebook, color: '#1877f2' },
        { network: 'linkedin', name: 'LinkedIn', icon: mdiLinkedin, color: '#007bb5' },
        { network: 'messenger', name: 'Messenger', icon: mdiFacebookMessenger, color: '#0084ff' },        
        { network: 'odnoklassniki', name: 'Odnoklassniki', icon: mdiOdnoklassniki, color: '#ed812b' },
        { network: 'pinterest', name: 'Pinterest', icon: mdiPinterest, color: '#bd081c' },
        { network: 'quora', name: 'Quora', icon: mdiQuora, color: '#a82400' },
        { network: 'reddit', name: 'Reddit', icon: mdiReddit, color: '#ff4500' },
        { network: 'skype', name: 'Skype', icon: mdiSkype, color: '#00aff0' },
        { network: 'telegram', name: 'Telegram', icon: mdiTelegram, color: '#0088cc' },        
        { network: 'twitter', name: 'Twitter', icon: mdiTwitter, color: '#1da1f2' },
        { network: 'vk', name: 'Vk', icon: mdiVk, color: '#4a76a8' },
        { network: 'whatsapp', name: 'Whatsapp', icon: mdiWhatsapp, color: '#25d366' },
      ],
      mdiShareVariant,
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

<style scoped>
  .share-network-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 1000px;
    margin: auto;
  }

  a[class^="share-network-"] {
    flex: none;
    color: #FFFFFF;
    background-color: #333;
    border-radius: 7px;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    cursor: pointer;
    margin: 0 10px 10px 0;
    text-decoration-line:none !important;
  }

  a[class^="share-network-"] i {
    /* background-color: rgba(0, 0, 0, 0.2); */
    padding: 2px;
    flex: 0 1 auto;
  }

  a[class^="share-network-"] span {
    padding: 0 10px;
    flex: 1 1 0%;
    font-weight: 500;
  }
  </style>
