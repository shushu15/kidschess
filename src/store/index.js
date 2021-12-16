import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
//import i18n from '@/plugins/i18n'; 
import * as KidsConst from '@/lib/const.js';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const state = {
  version: '1.0.5',
  isTitleShowing: true,
  isScreenReady: false,
  isDemo: false,
  showHelp: false,
  showDrawer: false,
  showIntro: false,
  currentTask: {}, 
  turn: '',
  webWorkerAI: undefined, 
  moveAI: '', 
  // TODO: Dynamically add depth on simple positions (field in tasks)
  engineDeep: [ 
    {depth: 1, mistake: 2, hint: '', reduce: 0},  // this entry is omitted, level starts from 1
    {depth: 1, mistake: 2, hint: 'level.1', reduce: 0}, 
    {depth: 1, mistake: 0, hint: 'level.2', reduce: 0},
    {depth: 7, mistake: 0, hint: 'level.3', reduce: 1},
    {depth: 14, mistake: 0, hint: 'level.4', reduce: 2},
  ],
  engineLevel: 2,
  gameActive: false,
  // canReload: false
  lastPromotion: '',   // last cell promoted
  finishedGame: false,
  flashAnimal: false,
  timerID: undefined,
  timeCallAI: 0,
  history: {
    moves: [],
  },
  snackbar: {
    message: '',
    type: KidsConst.TYPE_NONE,
  },
  longThinking: false,
  modeTwoPlayers: false,
  modeNoBackMoves: false,
  modeSpeech: false,
  speechSupported: true,
  // modeFlipPieces: false,
  forcedBtnStart: false, // while switching to one-player mode during a game
  // ----------------
  tasks : [
    { title: 'task.kingcloths.t',
      description: 'task.kingcloths.d',
      active: 0,
      avatar: require("@/assets/img/046-lion.svg"),
      data: [
        { 
          title: 'task.kingcloths.1.t',
          fen: '8/p6p/8/8/8/8/8/4K3 w - - 0 1',
          description: 'task.kingcloths.1.d',
          orientation: 'white',
          id: '1bdf210a-32b8-4112-89eb-596475f4e67a',
        },
        { 
          title: 'task.kingcloths.2.t',
          fen: '8/1p4p1/8/8/8/8/8/4K3 w - - 0 1',
          description: 'task.kingcloths.2.d',
          orientation: 'white',
          id: '297853ad-fc48-4137-8eaf-127c52984eb9',
        },
        { 
          title: 'task.kingcloths.3.t',
          fen: '8/2p2p2/8/8/8/8/8/4K3 w - - 0 1',
          description: 'task.kingcloths.3.d',
          orientation: 'white',
          id: '28ae8cd0-7895-474a-9baf-da2fdef8707c',
        },
        { 
          title: 'task.kingcloths.4.t',
          fen: '8/3pp3/8/8/8/8/8/4K3 w - - 0 1',
          description: 'task.kingcloths.4.d',
          orientation: 'white',
          id: '38666cf2-b286-4005-80ef-20abbeae35e5',
        },
        { 
          title: 'task.kingcloths.5.t',
          fen: '8/3ppp2/8/8/8/8/8/4K3 w - - 0 1',
          description: 'task.kingcloths.5.d',
          orientation: 'white',
          id: '250cb750-994e-429f-b392-a436e37edd83',
        },
      ]
    },

    { title: 'task.wolfkids.t',
      description: 'task.wolfkids.d',
      active: 0,                
      avatar: require("@/assets/img/098-wolf.svg"),
      cartoon: {
        white: require("@/assets/img/029-goat.svg"),
        black: require("@/assets/img/098-wolf.svg"),
      },
      data: [
        { 
          title: 'task.wolfkids.1.t',
          fen: '4r3/8/8/8/8/8/3PPP2/8 w - - 0 1',
          description: 'task.wolfkids.1.d',
          orientation: 'white',
          id: '157ca1d8-09eb-45dc-9529-668bb5562fa7',
        },
        { 
          title: 'task.wolfkids.2.t',
          fen: '3q4/8/8/8/8/8/PPPPPPPP/8 w - - 0 1',
          description: 'task.wolfkids.2.d',
          orientation: 'white',
          id: '0a336aca-77e1-4a12-8c35-f5771538a0b4',
          cartoon: require("@/assets/img/dragon.svg"), 
          // mistake_mult: 2,
        },
        { 
          title: 'task.wolfkids.3.t',
          fen: '3r4/8/8/8/8/8/2PPPP2/8 w - - 0 1',
          description: 'task.wolfkids.3.d',
          orientation: 'white',
          id: '21386bed-d3ed-4ee0-afd3-b59b6d7dd8cc', 
        },
        { 
          title: 'task.wolfkids.4.t',
          fen: '3r4/8/8/8/8/8/1PPPPP2/8 w - - 0 1',
          description: 'task.wolfkids.4.d',
          orientation: 'white',
          id: '50096326-6ea6-4c5b-b289-9b004a432df7', 
        },
        { 
          title: 'task.wolfkids.5.t',
          fen: '3r4/8/8/8/8/8/1PPPPPP1/8 w - - 0 1',
          description: 'task.wolfkids.5.d',
          orientation: 'white',
          id: '29fb5320-b749-4c9e-b859-ba7f7ff37f1b',
        },
      ]
    },

    { title: 'task.elephant.t',
      description: 'task.elephant.d',
      active: 0,                
      avatar: require("@/assets/img/022-elephant.svg"),
      data: [
        { 
          title: 'task.elephant.1.t',
          fen: '8/3pp3/8/8/8/8/8/2B5 w - - 0 1',
          description: 'task.elephant.1.d',
          orientation: 'white',
          id: '8d243eac-f466-4472-9061-455c0a4e6b1e', 
        },
        { 
          title: 'task.elephant.2.t',
          fen: '8/3pp3/8/8/8/8/8/5B2 w - - 0 1',
          description: 'task.elephant.2.d',
          orientation: 'white',
          id: 'ca18abbf-ccff-4b69-8a7c-b000d8fa8bd1', 
        },
        {
          title: 'task.elephant.3.t',
          fen: '8/3p1p2/8/8/8/8/8/2B5 w - - 0 1',
          description: 'task.elephant.3.d',
          orientation: 'white',
          id: 'c805e418-ed0c-4589-be9f-4be622cdf9a7', 
        },
        {
          title: 'task.elephant.4.t',
          fen: '8/3p1p2/8/8/8/8/8/5B2 w - - 0 1',
          description: 'task.elephant.4.d',
          orientation: 'white',
          id: '6bf4def0-975f-4651-bc04-62fa0a371d34',
        },
        {
          title: 'task.elephant.5.t',
          fen: '8/2p2p2/8/8/8/8/8/2B5 w - - 0 1',
          description: 'task.elephant.5.d',
          orientation: 'white',
          id: '2b414e79-9913-43ca-a813-41caca4209eb',
        },
        {
          title: 'task.elephant.6.t',
          fen: '8/2p2p2/8/8/8/8/8/5B2 w - - 0 1',
          description: 'task.elephant.6.d',
          orientation: 'white',
          id: '6ef817b4-218c-4446-a22c-39aaa9458dd0',
        },
        {
          title: 'task.elephant.7.t',
          fen: '8/1p4p1/8/8/8/8/8/2B5 w - - 0 1',
          description: 'task.elephant.7.d',
          orientation: 'white',
          id: 'c13703a7-e327-4aae-b366-70d76bcb4f57',
        },
        {
          title: 'task.elephant.8.t',
          fen: '8/1p4p1/8/8/8/8/8/5B2 w - - 0 1',
          description: 'task.elephant.8.d',
          orientation: 'white',
          id: 'd20da7dc-39ef-40c1-b994-d50a32c5a02b',
        },
        {
          title: 'task.elephant.9.t',
          fen: '8/p6p/8/8/8/8/8/2B5 w - - 0 1',
          description: 'task.elephant.9.d',
          orientation: 'white',
          id: 'b8c5216d-c40e-442a-8802-1248b43055a7',
        },
        {
          title: 'task.elephant.10.t',
          fen: '8/p6p/8/8/8/8/8/5B2 w - - 0 1',
          description: 'task.elephant.10.d',
          orientation: 'white',
          id: '26072c3a-9ade-4f12-a2e9-2af86993a282',
        },
        {
          title: 'task.elephant.11.t',
          fen: '8/2ppp3/8/8/8/8/8/2B5 w - - 0 1',
          description: 'task.elephant.11.d',
          orientation: 'white',
          id: '6948c3b4-955c-44c7-b36a-3913f64e1d1c',
        },
        {
          title: 'task.elephant.12.t',
          fen: '8/3ppp2/8/8/8/8/8/5B2 w - - 0 1',
          description: 'task.elephant.12.d',
          orientation: 'white',
          id: '856572ae-58b6-481c-8af3-7f76e5eb8e6a',
        },

      ]
    },
    { title: 'task.foxes.t',
      description: 'task.foxes.d',
      active: 0,
      avatar: require("@/assets/img/fox.svg"),
      cartoon: {
        white: require("@/assets/img/029-goat.svg"),
        black: require("@/assets/img/fox.svg"),
      },
      data: [
        { 
          title: 'task.foxes.1.t',
          fen: '2b2b2/8/8/8/8/8/2PPPP2/8 w - - 0 1',
          description: 'task.foxes.1.d',
          orientation: 'white',
          id: '8ef7af57-efc3-4391-8086-13bda00160a6',
        },
        { 
          title: 'task.foxes.2.t',
          fen: '2b2b2/8/8/8/8/8/2PPPPP1/8 w - - 0 1',
          description: 'task.foxes.2.d',
          orientation: 'white',
          id: '58921fad-384d-4641-84a5-14f9c9167ee6',
        },
        { 
          title: 'task.foxes.3.t',
          fen: '2b2b2/8/8/8/8/8/1PPPPPP1/8 w - - 0 1',
          description: 'task.foxes.3.d',
          orientation: 'white',
          id: '9d181456-acd5-4c24-8010-84abcbc317f3',
        },
      ]
    },

    { title: 'task.animals.t',
      description: 'task.animals.d',
      active: 0,
      avatar: require("@/assets/img/rabbit.svg"),
      cartoon: {
        white: require("@/assets/img/rabbit.svg"),
        black: require("@/assets/img/fox.svg"),
      },
      data: [
        { 
          title: 'task.animals.1.t',
          fen: '2b3n1/8/8/8/8/8/2PPPP2/8 w - - 0 1',
          description: 'task.animals.1.d',
          orientation: 'white',
          id: 'c3d3971c-2914-4783-92a6-02e29cf694f9',
        },
        { 
          title: 'task.animals.2.t',
          fen: '1n3b2/8/8/8/8/8/2PPPP2/8 w - - 0 1',
          description: 'task.animals.2.d',
          orientation: 'white',
          id: '8a8c1697-65c8-4365-89ab-ef0543fe7ebc',
        },
        { 
          title: 'task.animals.3.t',
          fen: '2b3n1/8/8/8/8/8/2PPPPP1/8 w - - 0 1',
          description: 'task.animals.3.d',
          orientation: 'white',
          id: '322c7b6a-4323-4993-8f07-b063e15ac775',
        },
        { 
          title: 'task.animals.4.t',
          fen: '1n3b2/8/8/8/8/8/2PPPPP1/8 w - - 0 1',
          description: 'task.animals.4.d',
          orientation: 'white',
          id: '9845fa49-85cf-4091-8808-3f63d677da91',
        },
      ]
    },

    { title: 'task.war.t',
      description: 'task.war.d',
      active: 0,                
      avatar: require("@/assets/img/heroe.svg"),
      rules: KidsConst.RULES_DEFAULT | KidsConst.RULES_3_REPETITION | KidsConst.RULES_MATERIAL_WIN,
      data: [
        { 
          title: 'task.war.1.t',
          fen: 'r7/ppp3p1/8/8/8/8/1P3PPP/7R w - - 0 1',
          description: 'task.war.1.d',
          orientation: 'white',
          id: '6d67f327-1788-4bd5-87bf-51844af7e5fa',
          difficulty: 1,
        },
        { 
          title: 'task.war.2.t',
          fen: '7r/1p3ppp/8/8/8/8/PPP3P1/R7 w - - 0 1',
          description: 'task.war.2.d',
          orientation: 'white',
          id: '487b9798-6a0a-4da7-a46b-fbdbebd39704',
          difficulty: 1,
        },
        { 
          title: 'task.war.3.t',
          fen: 'r1b5/ppp3p1/8/8/8/8/1P3PPP/5B1R w - - 0 1',
          description: 'task.war.3.d',
          orientation: 'white',
          id: 'f1351919-198f-420d-ae76-f2ff86de087b',
          difficulty: 1,
        },
        { 
          title: 'task.war.4.t',
          fen: '5b1r/1p3ppp/8/8/8/8/PPP3P1/R1B5 w - - 0 1',
          description: 'task.war.4.d',
          orientation: 'white',
          id: '57e2aeb8-e0eb-48c9-8f55-d94f26229ce1',
          difficulty: 1,
        },

         { 
          title: 'task.war.5.t',
          fen: 'r1b3n1/pppp2p1/8/8/8/8/1P2PPPP/1N3B1R w - - 0 1',
          description: 'task.war.5.d',
          orientation: 'white',
          id: 'd04cd230-5ce6-4374-8abb-571676f4e4ef',
          difficulty: 1,
        },
         { 
          title: 'task.war.6.t',
          fen: '1n3b1r/1p2pppp/8/8/8/8/PPPP2P1/R1B3N1 w - - 0 1',
          description: 'task.war.6.d',
          orientation: 'white',
          id: '45bf6f3d-c0d4-4c0d-8d9d-21cfe079fc54',
          difficulty: 1,
        },
    /*    { 
          title: {ru: 'Тест', en: 'Тест'},
          fen: '8/8/8/8/4K3/4Q2k/8/8 b - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          id:  'f4b99382-6004-411d-bacc-b8b046ddd21d',
          difficulty: -2,
          rules: KidsConst.RULES_CHESS,
        }, */

      ]
    },
    { title: 'task.kings.t',
      description: 'task.kings.d',
      active: 0,
      avatar: require("@/assets/img/black-panther.svg"),
      cartoon: {
        white: require("@/assets/img/046-lion.svg"),
        black: require("@/assets/img/black-panther.svg"),
      },
      rules: KidsConst.RULES_CHESS,
      data: [
        { 
          title: 'task.kings.1.t',
          fen: '4k3/8/8/8/8/8/4P3/4K3 w - - 0 1',
          description: 'task.kings.1.d',
          orientation: 'white',
          id: '3716cef4-ee2e-4b77-9f8f-6f4ab29f1d89',
          rules: KidsConst.RULES_CHESS | KidsConst.RULES_WHITE_MATE_IN_X | (30 << (Math.log2(KidsConst.RULES_BLACK_MATE_IN_X)+1)),
          difficulty: -3,
          dynamic: 3,
          movesAI: true,
        },
        { 
          title: 'task.kings.2.t',
          fen: '4k3/4p3/8/8/8/8/8/4K3 w - - 0 1',
          description: 'task.kings.2.d',
          orientation: 'white',
          id: '587e9e2a-72c1-47c1-9592-884c371c6d94',
          rules: KidsConst.RULES_CHESS | KidsConst.RULES_BLACK_MATE_IN_X | (30 << (Math.log2(KidsConst.RULES_BLACK_MATE_IN_X)+1)),
          difficulty: -3,
          dynamic: 3,
          movesAI: true,
        },
        { 
          title: 'task.kings.3.t',
          fen: '4k3/8/8/8/8/4P3/8/4K3 w - - 0 1',
          description: 'task.kings.3.d',
          orientation: 'white',
          id: '9e8c1f8c-6836-48c5-ac8d-33f617f67d27',
          rules: KidsConst.RULES_CHESS | KidsConst.RULES_WHITE_MATE_IN_X | (30 << (Math.log2(KidsConst.RULES_BLACK_MATE_IN_X)+1)),
          difficulty: -3,
          dynamic: 3,
          movesAI: true,
        },
        { 
          title: 'task.kings.4.t',
          fen: '4k3/1p3ppp/8/8/8/8/PPP3P1/4K3 w - - 0 1',
          description: 'task.kings.4.d',
          orientation: 'white',
          id: '9f631328-356e-4af9-a57e-a11a42ce8fe9',
          movesAI: true,
        },
        { 
          title: 'task.kings.5.t',
          fen: '4k3/pp3ppp/8/8/8/8/PPP3PP/4K3 w - - 0 1',
          description: 'task.kings.5.d',
          orientation: 'white',
          id: 'de802da2-dc42-4266-a4e7-87ea7af3869c',
          movesAI: true,
        },
        { 
          title: 'task.kings.6.t',
          fen: '4k1n1/pppppppp/8/8/8/8/PPPPPPPP/2B1K3 w - - 0 1',
          description: 'task.kings.6.d',
          orientation: 'white',
          id: '80136555-479a-4bca-8461-0abdb1704d0e',
          movesAI: true,
        },
        { 
          title: 'task.kings.7.t',
          fen: '4k1n1/pppppppp/8/8/8/8/PPPPPPPP/4KB2 w - - 0 1',
          description: 'task.kings.7.d',
          orientation: 'white',
          id: '9202e01b-2fc3-42e4-9a15-8f6d40ebd3cd',
          movesAI: true,
        },
      ]
    },

  ],

  standard:  { 
    title: 'task.std.t',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    description: 'task.std.d',
    orientation: 'white',
    id: '118ccf0b-9c1e-4129-a6db-929b36010a02',
    avatar: require("@/assets/img/crown.svg"),
    cartoon: { 
      white: require("@/assets/img/027-panda bear.svg"), 
      black: require("@/assets/img/010-cat.svg"), 
    },
    rules: KidsConst.RULES_CHESS,
    difficulty: 2,
    movesAI: true,
  },

};

export default new Vuex.Store({
  strict: debug,
  state,
  getters,
  mutations,
  actions,
});
