import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';


Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const state = {
  version: '0.1.2',
  HUMAN: 1,
  ROBOT: 2,
  isTitleShowing: true,
  showDrawer: false,
  currentTask: {}, 
  turn: '',
  webWorkerAI: undefined, 
  moveAI: '', 
  engineDeep: [1,2,6,10],
  engineLevel: 3,
  gameActive: false,
  // canReload: false
  lastPromotion: '',   // last cell promoted
  finishedGame: false,
  flashAnimal: false,
  timerID: undefined,
  timeCallAI: 0,
  history: {
    fen: [],
  },
  // ----------------
  tasks : [
    { title: {ru: 'Одежда для короля', en: "King's clothes"},
      description: { ru: 'Цель игры: полное уничтожение пешек или безопасное достижение любой пешкой поля превращения', 
                    en: 'Gamе purpose: the complete capturing of pawns or the safe reaching of any pawn to the square of promotion.' 
                    },
      active: 0,
      avatar: require("@/assets/img/046-lion.svg"),
      data: [
        { 
          title: {ru: 'Штаны для короля', en: "King's pants"},
          fen: '8/p6p/8/8/8/8/8/4K3 w - - 0 1',
          description: { ru: 'Пешки легко выигрывают', en: 'Pawns win easily' },
          orientation: 'white',
          id: '1bdf210a-32b8-4112-89eb-596475f4e67a',
        },
        { 
          title: {ru: 'Бриджи для короля', en: "King's breeches"},
          fen: '8/1p4p1/8/8/8/8/8/4K3 w - - 0 1',
          description: { ru: 'Пешки должны выиграть', en: 'The pawns must win' },
          orientation: 'white',
          id: '297853ad-fc48-4137-8eaf-127c52984eb9',
        },
        { 
          title: {ru: 'Шорты для короля', en: "King's shorts"},
          fen: '8/2p2p2/8/8/8/8/8/4K3 w - - 0 1',
          description: { ru: 'Король должен выиграть', en: 'The king must win' },
          orientation: 'white',
          id: '28ae8cd0-7895-474a-9baf-da2fdef8707c',
        },
        { 
          title: {ru: 'Трусы для короля', en: "King's underpants"},
          fen: '8/3pp3/8/8/8/8/8/4K3 w - - 0 1',
          description: { ru: 'Король легко выигрывает', en: 'The king wins easily' },
          orientation: 'white',
          id: '38666cf2-b286-4005-80ef-20abbeae35e5',
        },
        { 
          title: {ru: 'Юбка для короля', en: "King's skirt"},
          fen: '8/3ppp2/8/8/8/8/8/4K3 w - - 0 1',
          description: { ru: 'При точной игре пешки должны выигрывать. Самая сложная игра', en: 'With accurate play, the pawns should win. Hardest game' },
          orientation: 'white',
          id: '250cb750-994e-429f-b392-a436e37edd83',
        },
      ]
    },

    { title: {ru: 'Волк и Козлята', en: "Wolf and Kids"},
      description: { ru: 'Цель игры: полное уничтожение (или блокирование) противника или безопасное превращение пешки', 
                    en: 'Game purpose: complete capturing (or blocking) of the opponent or safe pawn promotion' 
                    },
      active: 0,                
      avatar: require("@/assets/img/098-wolf.svg"),
      cartoon: require("@/assets/img/029-goat.svg"),
      data: [
        { 
          title: {ru: 'Три Козленка', en: 'Three Kids'},
          fen: '7r/8/8/8/8/8/3PPP2/8 w - - 0 1',
          description: { ru: 'Ладья против 3х связанных пешек. Ладья должна выигрывать', en: 'Rook against 3 connected pawns. The rook must win' },
          orientation: 'white',
          id: '157ca1d8-09eb-45dc-9529-668bb5562fa7',
        },
        { 
          title: {ru: 'Змей Горыныч', en: 'Fire Dragon'},
          fen: '3q4/8/8/8/8/8/PPPPPPPP/8 w - - 0 1',
          description: { ru: 'Змей Горыныч с восьмью головами (пешками) пытается пролезть хотя бы одной головой в царский дворец (последняя горизонталь),  а Иван – Царевич (ферзь) должен не допустить этого и отрубить все головы Змея  Горыныча.',
                         en: 'The Fire Dragon with eight heads (pawns) is trying to crawl with at least one head into the royal palace (the last horizontal line), and Brave Princess (queen) must prevent this and cut off all the heads of the Fire Dragon.' },
          orientation: 'white',
          id: '0a336aca-77e1-4a12-8c35-f5771538a0b4',
          cartoon: require("@/assets/img/dragon.svg"), // change to some dragon-like
        },
        { 
          title: {ru: 'Четыре Козленка', en: 'Four Kids'},
          fen: '3r4/8/8/8/8/8/2PPPP2/8 w - - 0 1',
          description: { ru: 'Волк должен победить', en: 'The wolf must win' },
          orientation: 'white',
          id: '21386bed-d3ed-4ee0-afd3-b59b6d7dd8cc', 
        },
        { 
          title: {ru: 'Пять Козлят', en: 'Five Kids'},
          fen: '3r4/8/8/8/8/8/1PPPPP2/8 w - - 0 1',
          description: { ru: 'Шансы примерно равны', en: 'The odds are roughly equal' },
          orientation: 'white',
          id: '50096326-6ea6-4c5b-b289-9b004a432df7', 
        },
        { 
          title: {ru: 'Шесть Козлят', en: 'Six Kids'},
          fen: '3r4/8/8/8/8/8/1PPPPPP1/8 w - - 0 1',
          description: { ru: 'Козлята должны победить', en: 'The kids must win' },
          orientation: 'white',
          id: '29fb5320-b749-4c9e-b859-ba7f7ff37f1b',
        },
      ]
    },

    { title: {ru: 'Одежда для Слона', en: "Elephant clothes"},
      description: { ru: 'Цель игры: взаимное истребление или безопасное  достижение любой пешкой поля превращения. Белые начинают.', 
                    en: 'Game purpose: mutual capturing or safe reaching of the square of promotion by any pawn. White starts.' 
                    },
      active: 0,                
      avatar: require("@/assets/img/022-elephant.svg"),
      data: [
        { 
          title: {ru: 'Плавки для Слона', en: 'Elephant swim trunks'},
          fen: '8/3pp3/8/8/8/8/8/2B5 w - - 0 1',
          description: { ru: 'Белые должны выиграть', en: 'White must win' },
          orientation: 'white',
          id: '8d243eac-f466-4472-9061-455c0a4e6b1e', 
        },
        { 
          title: {ru: 'Плавки для Слона 2', en: 'Elephant swim trunks 2'},
          fen: '8/3pp3/8/8/8/8/8/5B2 w - - 0 1',
          description: { ru: 'Белые должны выиграть', en: 'White must win' },
          orientation: 'white',
          id: 'ca18abbf-ccff-4b69-8a7c-b000d8fa8bd1', 
        },
        {
          title: {ru: 'Трусы для Слона', en: 'Elephant underpants'},
          fen: '8/3p1p2/8/8/8/8/8/2B5 w - - 0 1',
          description: { ru: 'Белые легко выигрывают', en: 'White wins easily' },
          orientation: 'white',
          id: 'c805e418-ed0c-4589-be9f-4be622cdf9a7', 
        },
        {
          title: {ru: 'Трусы для Слона 2', en: 'Elephant underpants 2'},
          fen: '8/3p1p2/8/8/8/8/8/5B2 w - - 0 1',
          description: { ru: 'Белые легко выигрывают', en: 'White wins easily' },
          orientation: 'white',
          id: '6bf4def0-975f-4651-bc04-62fa0a371d34',
        },
        {
          title: {ru: 'Шорты для Слона', en: 'Elephant shorts'},
          fen: '8/2p2p2/8/8/8/8/8/2B5 w - - 0 1',
          description: { ru: 'При игре без ошибок белые легко выигрывают', en: 'White wins easily if they play without mistakes' },
          orientation: 'white',
          id: '2b414e79-9913-43ca-a813-41caca4209eb',
        },
        {
          title: {ru: 'Шорты для Слона 2', en: 'Elephant shorts 2'},
          fen: '8/2p2p2/8/8/8/8/8/5B2 w - - 0 1',
          description: { ru: 'При игре без ошибок белые легко выигрывают', en: 'White wins easily if they play without mistakes' },
          orientation: 'white',
          id: '6ef817b4-218c-4446-a22c-39aaa9458dd0',
        },
        {
          title: {ru: 'Бриджи для Слона', en: "Elephant's breeches"},
          fen: '8/1p4p1/8/8/8/8/8/2B5 w - - 0 1',
          description: { ru: 'При точной игре белые выигрывают', en: 'White wins if played accurately' },
          orientation: 'white',
          id: 'c13703a7-e327-4aae-b366-70d76bcb4f57',
        },
        {
          title: {ru: 'Бриджи для Слона 2', en: "Elephant's breeches 2"},
          fen: '8/1p4p1/8/8/8/8/8/5B2 w - - 0 1',
          description: { ru: 'При точной игре белые выигрывают', en: 'White wins if played accurately' },
          orientation: 'white',
          id: 'd20da7dc-39ef-40c1-b994-d50a32c5a02b',
        },
        {
          title: {ru: 'Штаны для Слона', en: 'Elephant pants'},
          fen: '8/p6p/8/8/8/8/8/2B5 w - - 0 1',
          description: { ru: 'При точной игре белые выигрывают', en: 'White wins if played accurately' },
          orientation: 'white',
          id: 'b8c5216d-c40e-442a-8802-1248b43055a7',
        },
        {
          title: {ru: 'Штаны для Слона 2', en: 'Elephant pants 2'},
          fen: '8/p6p/8/8/8/8/8/5B2 w - - 0 1',
          description: { ru: 'При точной игре белые выигрывают', en: 'White wins if played accurately' },
          orientation: 'white',
          id: '26072c3a-9ade-4f12-a2e9-2af86993a282',
        },
      ]
    },

    { title: {ru: 'Война и Мир', en: "War and Peace"},
      description: { ru: 'Цель игры – полное уничтожение противника или безопасное превращение пешки,  (т.е. так, чтобы соперник ответным ходом не уничтожил эту пешку)', 
                    en: 'The goal of the game is the complete destruction of the opponent or the safe promotion of the pawn, (i.e. so that the opponent does not destroy this pawn with a retaliatory move)', 
                    },
      active: 0,                
      avatar: require("@/assets/img/heroe.svg"),
      data: [
        { 
          title: {ru: 'Битва', en: 'Battle'},
          fen: 'r7/ppp3p1/8/8/8/8/1P3PPP/7R w - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          id: '6d67f327-1788-4bd5-87bf-51844af7e5fa',
        },
        { 
          title: {ru: 'Битва 2', en: 'Battle 2'},
          fen: '7r/1p3ppp/8/8/8/8/PPP3P1/R7 w - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          id: '487b9798-6a0a-4da7-a46b-fbdbebd39704',
        },
        { 
          title: {ru: 'Сражение', en: 'Struggle'},
          fen: 'r1b5/ppp3p1/8/8/8/8/1P3PPP/5B1R w - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          id: 'f1351919-198f-420d-ae76-f2ff86de087b',
        },
        { 
          title: {ru: 'Сражение 2', en: 'Struggle 2'},
          fen: '5b1r/1p3ppp/8/8/8/8/PPP3P1/R1B5 w - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          id: '57e2aeb8-e0eb-48c9-8f55-d94f26229ce1',
        },

         { 
          title: {ru: 'Война', en: 'War'},
          fen: 'r1b3n1/pppp2p1/8/8/8/8/1P2PPPP/1N3B1R w - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          id: 'd04cd230-5ce6-4374-8abb-571676f4e4ef',
        },
         { 
          title: {ru: 'Война 2', en: 'War 2'},
          fen: '1n3b1r/1p2pppp/8/8/8/8/PPPP2P1/R1B3N1 w - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          id: '45bf6f3d-c0d4-4c0d-8d9d-21cfe079fc54',
        },

      ]
    },
  ],

  standard:  { 
    title: {ru: 'Шахматы', en: 'Chess'},
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    description: { ru: 'Просто шахматы', en: 'Chess game' },
    orientation: 'white',
    id: '118ccf0b-9c1e-4129-a6db-929b36010a02',
    avatar: require("@/assets/img/crown.svg"),
    cartoon: require("@/assets/img/027-panda bear.svg"), // change to some alive like

  },

};

export default new Vuex.Store({
  strict: debug,
  state,
  getters,
  mutations,
  actions,
});
