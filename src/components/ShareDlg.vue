<template>
    <v-overlay opacity=0.7>
    <v-card class="px-2" 
      height="80vh"
      width="100vw"
      max-height="900"
      max-width="600"
      light
    >
              <v-fab-transition>
                <v-btn
                  v-show="$store.state.showShare"
                  color="pink"
                  fab
                  small
                  class="v-btn--close"
                  @click="closeShare()"
                >
                  <v-icon>{{mdiClose}}</v-icon>
                </v-btn>
         </v-fab-transition>
      <v-card-title class="text-h5 justify-center">{{$t('share.head')}}</v-card-title>
      <v-card-subtitle class="text-body-2 compact-h">{{$t('share.subhead')}}</v-card-subtitle>
      <v-card-text class="px-0 text-center">
        <v-btn-toggle v-model="activeapp">
        <v-btn
          class="ma-1"
          outlined
          large
          light
          color="blue"><div class="flexcol">
          <inline-svg  :src="require('../assets/img/icon-google-play.svg')"  width="24" height="24" />
            <div class="text-caption">Android</div>
          </div>  
        </v-btn>
        <v-btn
          class="ma-1"
          outlined
          large
          light
          color="blue"><div class="flexcol">
          <inline-svg  :src="require('../assets/img/icon-pwalogo.svg')"  width="48" height="24" />
            <div class="text-caption">PC, iOS</div>
          </div>  
        </v-btn>
        <v-btn
          class="ma-1"
          outlined
          large
          light
          color="blue"><div class="flexcol">
          <inline-svg  :src="require('../assets/img/icon-microsoft-store.svg')"  width="24" height="24" />
            <div class="text-caption">Windows App</div>
          </div>  
        </v-btn>
        </v-btn-toggle>
      </v-card-text>

      <v-card-text class="share-network-list">
      <ShareNetwork
        v-for="network in networks"
        :network="network.network"
        :key="network.network"
        :style="{backgroundColor: network.color}"
        :url="sharing.url[activeapp]"
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
      <v-card-text class="pa-0">
        <v-tooltip v-model="showCopy" z-index="10" top :open-on-hover="false" :open-on-click="false" >
          <template v-slot:activator="{ on, attrs }">

         <v-text-field
            :value="sharing.url[activeapp]"
            :label="$t('share.copy')"
            filled
            readonly
            @click="actCopy(sharing.url[activeapp])"  v-bind="attrs" v-on="on"
          ></v-text-field>
          <v-avatar
            tile
            color="white"
            size="48"
             @click="actCopy(sharing.qr[activeapp],true)" 
          >
            <img :src="sharing.qr[activeapp]" alt="QR">
          </v-avatar>        

          </template>
          <span>{{this.copyMessage}}</span>
        </v-tooltip>
      </v-card-text>
    </v-card>
    </v-overlay>
</template>

<script>
// import ShareNetwork from 'vue-social-sharing';
// import ShareNetwork from '@/lib/vendor/share/vue-social-sharing.vue';
import { mdiFacebook,mdiLinkedin,mdiFacebookMessenger,mdiOdnoklassniki,mdiPinterest,mdiQuora,mdiReddit,
        mdiSkype,mdiTelegram,mdiTwitter,mdiVk,mdiWhatsapp,mdiShareVariant,mdiClose} from '@mdi/js';
import ShareNetwork from '@/lib/vendor/share/share-network.js';
import InlineSvg from 'vue-inline-svg';

export default {
  name: 'ShareDlg',
  components: {
    ShareNetwork,
    InlineSvg
  },

  data() {
    return {
      // dialog: false,
      activeapp: 0,
      showCopy: false,
      copyMessage: '',
      sharing: {
        url: ['https://play.google.com/store/apps/details?id=com.ownlinks.kidschess','https://kidschess.ownlinks.com',`https://www.microsoft.com/${this.langpath()}p/kidschess/9pdgwhlsqbf6`],
        qr:['img/kidschess-google-qr.png','img/kidschess-pwa-qr.png','img/kidschess-microsoft-qr.png'],
        title: this.$i18n.t('share.title'),
        description: this.$i18n.t('share.description'),
        quote: this.$i18n.t('share.quote'),
        hashtags: this.$i18n.t('share.hashtags'),
        twitterUser: '',
        media: 'https://kidschess.ownlinks.com/img/icons/ms-icon-144x144.png'
      },
      networks: [
        { network: 'facebook', name: 'Facebook', icon: mdiFacebook, color: '#1877f2' },
        { network: 'linkedin', name: 'LinkedIn', icon: mdiLinkedin, color: '#007bb5' },
        { network: 'messenger', name: 'Messenger', icon: mdiFacebookMessenger, color: '#0084ff' },        
        { network: 'pinterest', name: 'Pinterest', icon: mdiPinterest, color: '#bd081c' },
        { network: 'quora', name: 'Quora', icon: mdiQuora, color: '#a82400' },
        { network: 'odnoklassniki', name: 'Odnoklassniki', icon: mdiOdnoklassniki, color: '#ed812b' },
        { network: 'reddit', name: 'Reddit', icon: mdiReddit, color: '#ff4500' },
        { network: 'skype', name: 'Skype', icon: mdiSkype, color: '#00aff0' },
        { network: 'telegram', name: 'Telegram', icon: mdiTelegram, color: '#0088cc' },        
        { network: 'twitter', name: 'Twitter', icon: mdiTwitter, color: '#1da1f2' },
        { network: 'vk', name: 'Vk', icon: mdiVk, color: '#4a76a8' },
        { network: 'whatsapp', name: 'Whatsapp', icon: mdiWhatsapp, color: '#25d366' },
      ],
      mdiShareVariant,
      mdiClose
    };
  },
  methods: {
    closeShare() {
      this.$store.commit('toggleShare', { show: false });
    },
    actCopy(src, binary=false) {
      let self = this;
      navigator.permissions.query({name: "clipboard-write"}).then(result => {
        if (result.state == "granted" || result.state == "prompt") {
          /* write to the clipboard now */
          this.updateClipboard(src, binary, self);
        }
      });
    },
    async updateClipboard(newClip, binary, self) {
      let P1;
      if (binary) {
        const response = await fetch(newClip);
        const blob = await response.blob();
        const data = [new window.ClipboardItem({ [blob.type]: blob })];  // blob.type =="image/png"
        P1 = navigator.clipboard.write(data);
      } else {
        P1 = navigator.clipboard.writeText(newClip);
      }
      P1.then(function() {
          /* clipboard successfully set */
          self.copyMessage = self.$i18n.t('message.copy.ok');
          self.showCopy = true;
          setTimeout(() => { self.showCopy = false; /* self.copyMessage='';*/}, 2000); 
        }, function() {
        /* clipboard write failed */
          self.copyMessage = self.$i18n.t('message.copy.error');
          self.showCopy = true;
          setTimeout(() => { self.showCopy = false; /* self.copyMessage='';*/}, 2000); 
      });
    },
    langpath() {
      return `${this.$i18n.locale}-${this.$i18n.locale==='en'? 'us':this.$i18n.locale}/`;
    }

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
  .v-btn--close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
  }

  .compact-h {
    line-height: 1rem;
  }
  .v-btn .flexcol {
    display:flex!important;
    flex-direction: column!important;    
    text-transform: none !important;
    align-items: center;  /* vertical alignment of items */
  }  

  .link-line {
    flex-shrink:0;
  }
  </style>
