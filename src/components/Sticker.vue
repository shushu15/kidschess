<template>
    <v-icon :size="this.size" :color="this.iconColor">{{getStickerIcon(this.iconName)}}</v-icon>         
</template>
<script> 

import { mdiStar,mdiStarFace,mdiStarFourPoints,mdiShieldStar,mdiFlowerTulip,mdiFlower,mdiFlowerPoppy,mdiChessKing,mdiChessQueen,mdiBell,mdiRocket,mdiAirplane,mdiBird,mdiCarConvertible,mdiEmoticonCoolOutline,mdiHeart,mdiCat,mdiDog} from '@mdi/js';
const namesStickers = [
    {n: 'mdiStar', i: mdiStar},
    {n: 'mdiStarFace', i: mdiStarFace},
    {n: 'mdiStarFourPoints', i: mdiStarFourPoints},
    {n: 'mdiShieldStar', i: mdiShieldStar},
    {n: 'mdiFlowerTulip', i: mdiFlowerTulip},
    {n: 'mdiFlower', i: mdiFlower},
    {n: 'mdiFlowerPoppy', i: mdiFlowerPoppy},
    {n: 'mdiChessKing', i: mdiChessKing},
    {n: 'mdiChessQueen', i: mdiChessQueen},
    {n: 'mdiBell', i: mdiBell},
    {n: 'mdiRocket', i: mdiRocket},
    {n: 'mdiAirplane', i: mdiAirplane},
    {n: 'mdiBird', i: mdiBird},
    {n: 'mdiCarConvertible', i: mdiCarConvertible},   
    {n: 'mdiEmoticonCoolOutline', i: mdiEmoticonCoolOutline},
    {n: 'mdiHeart', i: mdiHeart},
    {n: 'mdiCat', i: mdiCat},
    {n: 'mdiDog', i: mdiDog},
    ];

export default {
  // functional: true,
  name: 'Sticker',
  props: {
    iconName: String,
    iconColor: String,
    size: {
      type: Number,
      default: 56
    },
  },
  // not using "methods" in functional components https://dev.to/vhoyer/functional-components-in-vue-js-20fl - comments
  methods: {
    getStickerIcon(icN) {
        return namesStickers.find((elem) => elem.n === icN).i;
    }
  }

}
</script>