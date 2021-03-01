import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';


Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const state = {
  version: '0.1.1d',
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
  // ----------------
  tasks : [
    { title: {ru: 'Одежда для короля', en: "King's clothes"},
      description: { ru: 'Цель игры: полное уничтожение пешек или безопасное достижение любой пешкой поля превращения', 
                    en: 'Цель игры: полное уничтожение пешек или безопасное достижение любой пешкой поля превращения.' 
                    },
      active: 0,
      avatar: require("@/assets/img/046-lion.svg"),
      data: [
        { 
          title: {ru: 'Штаны для короля', en: "King's pants"},
          fen: '8/p6p/8/8/8/8/8/4K3 w - - 0 1',
          description: { ru: 'Пешки легко выигрывают', en: 'Пешки легко выигрывают' },
          orientation: 'white',
          service: {id: '1bdf210a-32b8-4112-89eb-596475f4e67a', active: false },
        },
        { 
          title: {ru: 'Бриджи для короля', en: "King's breeches"},
          fen: '8/1p4p1/8/8/8/8/8/4K3 w - - 0 1',
          description: { ru: 'Пешки должны выиграть', en: 'Пешки должны выиграть' },
          orientation: 'white',
          service: {id: '297853ad-fc48-4137-8eaf-127c52984eb9', active: false },
        },
        { 
          title: {ru: 'Шорты для короля', en: "King's shorts"},
          fen: '8/2p2p2/8/8/8/8/8/4K3 w - - 0 1',
          description: { ru: 'Король должен выиграть', en: 'Король должен выиграть' },
          orientation: 'white',
          service: {id: '28ae8cd0-7895-474a-9baf-da2fdef8707c', active: false },
        },
        { 
          title: {ru: 'Трусы для короля', en: "King's underpants"},
          fen: '8/3pp3/8/8/8/8/8/4K3 w - - 0 1',
          description: { ru: 'Король легко выигрывает', en: 'Король легко выигрывает' },
          orientation: 'white',
          service: {id: '38666cf2-b286-4005-80ef-20abbeae35e5', active: false },
        },
        { 
          title: {ru: 'Юбка для короля', en: "King's skirt"},
          fen: '8/3ppp2/8/8/8/8/8/4K3 w - - 0 1',
          description: { ru: 'При точной игре пешки должны выигрывать. Самая сложная игра', en: 'При точной игре пешки должны выигрывать. Самая сложная игра' },
          orientation: 'white',
          service: {id: '250cb750-994e-429f-b392-a436e37edd83', active: false },
        },
      ]
    },

    { title: {ru: 'Волк и Козлята', en: "Wolf and Kids"},
      description: { ru: 'Цель игры: полное уничтожение (или блокирование) противника или безопасное превращение пешки', 
                    en: 'Цель игры: полное уничтожение (или блокирование) противника или безопасное превращение пешки' 
                    },
      active: 0,                
      avatar: require("@/assets/img/098-wolf.svg"),
      cartoon: require("@/assets/img/029-goat.svg"),
      data: [
        { 
          title: {ru: 'Три Козленка', en: 'Three Kids'},
          fen: '7r/8/8/8/8/8/3PPP2/8 w - - 0 1',
          description: { ru: 'Ладья против 3х связанных пешек. Ладья должна выигрывать', en: 'Ладья против 3х связанных пешек. Ладья должна выигрывать' },
          orientation: 'white',
          service: {id: '157ca1d8-09eb-45dc-9529-668bb5562fa7', active: false },
        },
        { 
          title: {ru: 'Змей Горыныч', en: 'Fire Dragon'},
          fen: '3q4/8/8/8/8/8/PPPPPPPP/8 w - - 0 1',
          description: { ru: 'Змей Горыныч с восьмью головами (пешками) пытается пролезть хотя бы одной головой в царский дворец (последняя горизонталь),  а Иван – Царевич (ферзь) должен не допустить этого и отрубить все головы Змея  Горыныча.',
                         en: 'Змей Горыныч с восьмью головами (пешками) пытается пролезть хотя бы одной головой в царский дворец (последняя горизонталь),  а Иван – Царевич (ферзь) должен не допустить этого и отрубить все головы Змея  Горыныча.' },
          orientation: 'white',
          service: {id: '0a336aca-77e1-4a12-8c35-f5771538a0b4', active: false },
          cartoon: require("@/assets/img/046-lion.svg"), // change to some dragon-like
        },
        { 
          title: {ru: 'Четыре Козленка', en: 'Four Kids'},
          fen: '3r4/8/8/8/8/8/2PPPP2/8 w - - 0 1',
          description: { ru: 'Волк должен победить', en: 'Волк должен победить' },
          orientation: 'white',
          service: {id: '21386bed-d3ed-4ee0-afd3-b59b6d7dd8cc', active: false },
        },
        { 
          title: {ru: 'Пять Козлят', en: 'Five Kids'},
          fen: '3r4/8/8/8/8/8/1PPPPP2/8 w - - 0 1',
          description: { ru: 'Шансы примерно равны', en: 'Шансы примерно равны' },
          orientation: 'white',
          service: {id: '50096326-6ea6-4c5b-b289-9b004a432df7', active: false },
        },
        { 
          title: {ru: 'Шесть Козлят', en: 'Six Kids'},
          fen: '3r4/8/8/8/8/8/1PPPPPP1/8 w - - 0 1',
          description: { ru: 'Козлята должны победить', en: 'Козлята должны победить' },
          orientation: 'white',
          service: {id: '29fb5320-b749-4c9e-b859-ba7f7ff37f1b', active: false },
        },
      ]
    },

    { title: {ru: 'Одежда для Слона', en: "Elephant clothes"},
      description: { ru: 'Цель игры: взаимное истребление или безопасное  достижение любой пешкой поля превращения. Белые начинают.', 
                    en: 'Цель игры: взаимное истребление или безопасное  достижение любой пешкой поля превращения. Белые начинают.' 
                    },
      active: 0,                
      avatar: require("@/assets/img/022-elephant.svg"),
      data: [
        { 
          title: {ru: 'Плавки для Слона', en: 'Elephant swim trunks'},
          fen: '8/3pp3/8/8/8/8/8/2B5 w - - 0 1',
          description: { ru: 'Белые должны выиграть', en: 'Белые должны выиграть' },
          orientation: 'white',
          service: {id: '8d243eac-f466-4472-9061-455c0a4e6b1e', active: false },
        },
        { 
          title: {ru: 'Плавки для Слона 2', en: 'Elephant swim trunks 2'},
          fen: '8/3pp3/8/8/8/8/8/5B2 w - - 0 1',
          description: { ru: 'Белые должны выиграть', en: 'Белые должны выиграть' },
          orientation: 'white',
          service: {id: 'ca18abbf-ccff-4b69-8a7c-b000d8fa8bd1', active: false },
        },
        {
          title: {ru: 'Трусы для Слона', en: 'Elephant underpants'},
          fen: '8/3p1p2/8/8/8/8/8/2B5 w - - 0 1',
          description: { ru: 'Белые легко выигрывают', en: 'Белые легко выигрывают' },
          orientation: 'white',
          service: {id: 'c805e418-ed0c-4589-be9f-4be622cdf9a7', active: false },
        },
        {
          title: {ru: 'Трусы для Слона 2', en: 'Elephant underpants 2'},
          fen: '8/3p1p2/8/8/8/8/8/5B2 w - - 0 1',
          description: { ru: 'Белые легко выигрывают', en: 'Белые легко выигрывают' },
          orientation: 'white',
          service: {id: '6bf4def0-975f-4651-bc04-62fa0a371d34', active: false },
        },
        {
          title: {ru: 'Шорты для Слона', en: 'Elephant shorts'},
          fen: '8/2p2p2/8/8/8/8/8/2B5 w - - 0 1',
          description: { ru: 'При игре без ошибок белые легко выигрывают', en: 'При игре без ошибок белые легко выигрывают' },
          orientation: 'white',
          service: {id: '2b414e79-9913-43ca-a813-41caca4209eb', active: false },
        },
        {
          title: {ru: 'Шорты для Слона 2', en: 'Elephant shorts 2'},
          fen: '8/2p2p2/8/8/8/8/8/5B2 w - - 0 1',
          description: { ru: 'При игре без ошибок белые легко выигрывают', en: 'При игре без ошибок белые легко выигрывают' },
          orientation: 'white',
          service: {id: '6ef817b4-218c-4446-a22c-39aaa9458dd0', active: false },
        },
        {
          title: {ru: 'Бриджи для Слона', en: "Elephant's breeches"},
          fen: '8/1p4p1/8/8/8/8/8/2B5 w - - 0 1',
          description: { ru: 'При точной игре белые выигрывают', en: 'При точной игре белые выигрывают' },
          orientation: 'white',
          service: {id: 'c13703a7-e327-4aae-b366-70d76bcb4f57', active: false },
        },
        {
          title: {ru: 'Бриджи для Слона 2', en: "Elephant's breeches 2"},
          fen: '8/1p4p1/8/8/8/8/8/5B2 w - - 0 1',
          description: { ru: 'При точной игре белые выигрывают', en: 'При точной игре белые выигрывают' },
          orientation: 'white',
          service: {id: 'd20da7dc-39ef-40c1-b994-d50a32c5a02b', active: false },
        },
        {
          title: {ru: 'Штаны для Слона', en: 'Elephant pants'},
          fen: '8/p6p/8/8/8/8/8/2B5 w - - 0 1',
          description: { ru: 'При точной игре белые выигрывают', en: 'При точной игре белые выигрывают' },
          orientation: 'white',
          service: {id: 'b8c5216d-c40e-442a-8802-1248b43055a7', active: false },
        },
        {
          title: {ru: 'Штаны для Слона 2', en: 'Elephant pants 2'},
          fen: '8/p6p/8/8/8/8/8/5B2 w - - 0 1',
          description: { ru: 'При точной игре белые выигрывают', en: 'При точной игре белые выигрывают' },
          orientation: 'white',
          service: {id: '26072c3a-9ade-4f12-a2e9-2af86993a282', active: false },
        },
      ]
    },

    { title: {ru: 'Война и Мир', en: "War and Peace"},
      description: { ru: 'Цель игры – полное уничтожение противника или безопасное превращение пешки,  (т.е. так, чтобы соперник ответным ходом не уничтожил эту пешку)', 
                    en: 'Цель игры – полное уничтожение противника или безопасное превращение пешки,  (т.е. так, чтобы соперник ответным ходом не уничтожил эту пешку)', 
                    },
      active: 0,                
      avatar: require("@/assets/img/heroe.svg"),
      data: [
        { 
          title: {ru: 'Битва', en: 'Battle'},
          fen: 'r7/ppp3p1/8/8/8/8/1P3PPP/7R w - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          service: {id: '6d67f327-1788-4bd5-87bf-51844af7e5fa', active: false },
        },
        { 
          title: {ru: 'Битва 2', en: 'Battle 2'},
          fen: '7r/1p3ppp/8/8/8/8/PPP3P1/R7 w - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          service: {id: '487b9798-6a0a-4da7-a46b-fbdbebd39704', active: false },
        },
        { 
          title: {ru: 'Сражение', en: 'Struggle'},
          fen: 'r1b5/ppp3p1/8/8/8/8/1P3PPP/5B1R w - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          service: {id: 'f1351919-198f-420d-ae76-f2ff86de087b', active: false },
        },
        { 
          title: {ru: 'Сражение 2', en: 'Struggle 2'},
          fen: '5b1r/1p3ppp/8/8/8/8/PPP3P1/R1B5 w - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          service: {id: '57e2aeb8-e0eb-48c9-8f55-d94f26229ce1', active: false },
        },

         { 
          title: {ru: 'Война', en: 'War'},
          fen: 'r1b3n1/pppp2p1/8/8/8/8/1P2PPPP/1N3B1R w - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          service: {id: 'd04cd230-5ce6-4374-8abb-571676f4e4ef', active: false },
        },
         { 
          title: {ru: 'Война 2', en: 'War 2'},
          fen: '1n3b1r/1p2pppp/8/8/8/8/PPPP2P1/R1B3N1 w - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          service: {id: '45bf6f3d-c0d4-4c0d-8d9d-21cfe079fc54', active: false },
        },

      ]
    },
  ],

  standard:  { 
    title: {ru: 'Шахматы', en: 'Chess'},
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    description: { ru: 'Просто шахматы', en: 'Chess game' },
    orientation: 'white',
    service: {id: '118ccf0b-9c1e-4129-a6db-929b36010a02', active: false },
    avatar: require("@/assets/img/crown.svg"),
    cartoon: require("@/assets/img/046-lion.svg"), // change to some alive like


  },

};

export default new Vuex.Store({
  strict: debug,
  state,
  getters,
  mutations,
  actions,
});
