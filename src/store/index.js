import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import i18n from '@/plugins/i18n'; 
import * as KidsConst from '@/lib/const.js';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const state = {
  version: '0.1.6',
  isTitleShowing: true,
  showDrawer: false,
  currentTask: {}, 
  turn: '',
  webWorkerAI: undefined, 
  moveAI: '', 
  // TODO: Dynamically add depth on simple positions (field in tasks)
  engineDeep: [ 
    {depth: 1, mistake: 2, hint: '', reduce: 0},  // this entry is omitted, level starts from 1
    {depth: 1, mistake: 2, hint: i18n.t('level.1'), reduce: 0}, 
    {depth: 1, mistake: 0, hint: i18n.t('level.2'), reduce: 0},
    {depth: 7, mistake: 0, hint: i18n.t('level.3'), reduce: 1},
    {depth: 14, mistake: 0, hint: i18n.t('level.4'), reduce: 2},
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
  snackbarMessage: '',
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
      cartoon: {
        white: require("@/assets/img/029-goat.svg"),
        black: require("@/assets/img/098-wolf.svg"),
      },
      data: [
        { 
          title: {ru: 'Три Козленка', en: 'Three Kids'},
          fen: '4r3/8/8/8/8/8/3PPP2/8 w - - 0 1',
          description: { ru: 'Ладья против 3х связанных пешек. Ладья должна выигрывать', en: 'Rook against 3 connected pawns. The rook must win' },
          orientation: 'white',
          id: '157ca1d8-09eb-45dc-9529-668bb5562fa7',
        },
        { 
          title: {ru: 'Змей Горыныч', en: 'Fire Dragon'},
          fen: '3q4/8/8/8/8/8/PPPPPPPP/8 w - - 0 1',
          description: { ru: 'Змей Горыныч с восьмью головами (пешками) пытается пролезть хотя бы одной головой в царский дворец (последняя горизонталь),  а Иван – Царевич (ферзь) должен не допустить этого и отрубить все головы Змея  Горыныча.',
                         en: 'The Fire Dragon with eight heads (pawns) is trying to crawl with at least one head into the royal palace (the last horizontal line), and Brave Prince (queen) must prevent this and cut off all the heads of the Fire Dragon.' },
          orientation: 'white',
          id: '0a336aca-77e1-4a12-8c35-f5771538a0b4',
          cartoon: require("@/assets/img/dragon.svg"), 
          // mistake_mult: 2,
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
        {
          title: {ru: 'Юбка для Слона', en: "Elephant's skirt"},
          fen: '8/2ppp3/8/8/8/8/8/2B5 w - - 0 1',
          description: { ru: 'При точной игре белые выигрывают', en: 'White wins if played accurately' },
          orientation: 'white',
          id: '6948c3b4-955c-44c7-b36a-3913f64e1d1c',
        },
        {
          title: {ru: 'Юбка для Слона 2', en: "Elephant's skirt 2"},
          fen: '8/3ppp2/8/8/8/8/8/5B2 w - - 0 1',
          description: { ru: 'При точной игре белые выигрывают', en: 'White wins if played accurately' },
          orientation: 'white',
          id: '856572ae-58b6-481c-8af3-7f76e5eb8e6a',
        },

      ]
    },
    { title: {ru: 'Злые Лисицы', en: "Angry Foxes"},
      description: { ru: 'Цель игры: полное уничтожение пешек или безопасное достижение любой пешкой поля превращения', 
                    en: 'Gamе purpose: the complete capturing of pawns or the safe reaching of any pawn to the square of promotion.' 
                    },
      active: 0,
      avatar: require("@/assets/img/fox.svg"),
      cartoon: {
        white: require("@/assets/img/029-goat.svg"),
        black: require("@/assets/img/fox.svg"),
      },
      data: [
        { 
          title: {ru: 'Лисицы и 4 козленка', en: "Foxes and 4 Kids"},
          fen: '2b2b2/8/8/8/8/8/2PPPP2/8 w - - 0 1',
          description: { ru: 'Лисицы-слоны легко выигрывают', en: 'Foxes-bishops win easily' },
          orientation: 'white',
          id: '8ef7af57-efc3-4391-8086-13bda00160a6',
        },
        { 
          title: {ru: 'Лисицы и 5 козлят', en: "Foxes and 5 Kids"},
          fen: '2b2b2/8/8/8/8/8/2PPPPP1/8 w - - 0 1',
          description: { ru: 'Лисицы-слоны должны выиграть', en: 'Foxes-bishops must win' },
          orientation: 'white',
          id: '58921fad-384d-4641-84a5-14f9c9167ee6',
        },
        { 
          title: {ru: 'Лисицы и 6 козлят', en: "Foxes and 6 Kids"},
          fen: '2b2b2/8/8/8/8/8/1PPPPPP1/8 w - - 0 1',
          description: { ru: 'Козлята должны выиграть', en: 'Kids must win' },
          orientation: 'white',
          id: '9d181456-acd5-4c24-8010-84abcbc317f3',
        },
      ]
    },

    { title: {ru: 'Лесные звери', en: "Forest animals"},
      description: { ru: 'Цель игры: полное уничтожение пешек или безопасное достижение любой пешкой поля превращения', 
                    en: 'Gamе purpose: the complete capturing of pawns or the safe reaching of any pawn to the square of promotion.' 
                    },
      active: 0,
      avatar: require("@/assets/img/rabbit.svg"),
      cartoon: {
        white: require("@/assets/img/rabbit.svg"),
        black: require("@/assets/img/fox.svg"),
      },
      data: [
        { 
          title: {ru: 'Лиса, Волк, 4 Зайца', en: "Fox, Wolf, 4 Rabbits"},
          fen: '2b3n1/8/8/8/8/8/2PPPP2/8 w - - 0 1',
          description: { ru: 'Лиса и Волк выигрывают', en: 'Fox and Wolf win' },
          orientation: 'white',
          id: 'c3d3971c-2914-4783-92a6-02e29cf694f9',
        },
        { 
          title: {ru: 'Лиса, Волк, 4 Зайца', en: "Fox, Wolf, 4 Rabbits"},
          fen: '1n3b2/8/8/8/8/8/2PPPP2/8 w - - 0 1',
          description: { ru: 'Лиса и Волк выигрывают', en: 'Fox and Wolf win' },
          orientation: 'white',
          id: '8a8c1697-65c8-4365-89ab-ef0543fe7ebc',
        },
        { 
          title: {ru: 'Лиса, Волк, 5 Зайцев', en: "Fox, Wolf, 5 Rabbits"},
          fen: '2b3n1/8/8/8/8/8/2PPPPP1/8 w - - 0 1',
          description: { ru: 'Шансы примерно равны', en: 'The odds are roughly equal' },
          orientation: 'white',
          id: '322c7b6a-4323-4993-8f07-b063e15ac775',
        },
        { 
          title: {ru: 'Лиса, Волк, 5 Зайцев', en: "Fox, Wolf, 5 Rabbits"},
          fen: '1n3b2/8/8/8/8/8/2PPPPP1/8 w - - 0 1',
          description: { ru: 'Шансы примерно равны', en: 'The odds are roughly equal' },
          orientation: 'white',
          id: '9845fa49-85cf-4091-8808-3f63d677da91',
        },
      ]
    },

    { title: {ru: 'Война и Мир', en: "War and Peace"},
      description: { ru: 'Цель игры – полное уничтожение противника или безопасное превращение пешки,  (т.е. так, чтобы соперник ответным ходом не уничтожил её). Если на доске не осталось пешек, победа определяется по суммарной стоимости оставшихся фигур', 
                    en: 'The goal of the game is the complete destruction of the opponent or the safe promotion of the pawn, (i.e. so that the opponent does not capture it with a retaliatory move). If there are no pawns left on the board, the victory is determined by the cost of the remaining pieces', 
                    },
      active: 0,                
      avatar: require("@/assets/img/heroe.svg"),
      rules: KidsConst.RULES_DEFAULT | KidsConst.RULES_3_REPETITION | KidsConst.RULES_MATERIAL_WIN,
      data: [
        { 
          title: {ru: 'Битва', en: 'Battle'},
          fen: 'r7/ppp3p1/8/8/8/8/1P3PPP/7R w - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          id: '6d67f327-1788-4bd5-87bf-51844af7e5fa',
          difficulty: 1,
        },
        { 
          title: {ru: 'Битва 2', en: 'Battle 2'},
          fen: '7r/1p3ppp/8/8/8/8/PPP3P1/R7 w - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          id: '487b9798-6a0a-4da7-a46b-fbdbebd39704',
          difficulty: 1,
        },
        { 
          title: {ru: 'Сражение', en: 'Struggle'},
          fen: 'r1b5/ppp3p1/8/8/8/8/1P3PPP/5B1R w - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          id: 'f1351919-198f-420d-ae76-f2ff86de087b',
          difficulty: 1,
        },
        { 
          title: {ru: 'Сражение 2', en: 'Struggle 2'},
          fen: '5b1r/1p3ppp/8/8/8/8/PPP3P1/R1B5 w - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          id: '57e2aeb8-e0eb-48c9-8f55-d94f26229ce1',
          difficulty: 1,
        },

         { 
          title: {ru: 'Война', en: 'War'},
          fen: 'r1b3n1/pppp2p1/8/8/8/8/1P2PPPP/1N3B1R w - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          id: 'd04cd230-5ce6-4374-8abb-571676f4e4ef',
          difficulty: 1,
        },
         { 
          title: {ru: 'Война 2', en: 'War 2'},
          fen: '1n3b1r/1p2pppp/8/8/8/8/PPPP2P1/R1B3N1 w - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          id: '45bf6f3d-c0d4-4c0d-8d9d-21cfe079fc54',
          difficulty: 1,
        },
    /*    { 
          title: {ru: 'Тест', en: 'Тест'},
          fen: '6br/8/8/8/8/8/8/R7 w - - 0 1',
          description: { ru: '', en: '' },
          orientation: 'white',
          id:  'f4b99382-6004-411d-bacc-b8b046ddd21d',
          difficulty: 1,
        }, */

      ]
    },
    { title: {ru: 'Битва Королей', en: "Battle of Kings"},
      description: { ru: 'Цель игры: поставить мат', 
                    en: 'Gamе purpose: checkmate' 
                    },
      active: 0,
      avatar: require("@/assets/img/black-panther.svg"),
      cartoon: {
        white: require("@/assets/img/046-lion.svg"),
        black: require("@/assets/img/black-panther.svg"),
      },
      rules: KidsConst.RULES_CHESS,
      difficulty: 1,
      data: [
        { 
          title: {ru: 'Маленький Волшебник', en: "Little Wizard"},
          fen: '4k3/8/8/8/8/8/4P3/4K3 w - - 0 1',
          description: { ru: 'Поставить мат за 30 ходов. Белые должны выиграть', en: 'Checkmate in 30 moves. White must win' },
          orientation: 'white',
          id: '3716cef4-ee2e-4b77-9f8f-6f4ab29f1d89',
          rules: KidsConst.RULES_CHESS | KidsConst.RULES_WHITE_MATE_IN_X | (30 << (Math.log2(KidsConst.RULES_BLACK_MATE_IN_X)+1)),
        },
        { 
          title: {ru: 'Черный гном', en: "Black gnome"},
          fen: '4k3/4p3/8/8/8/8/8/4K3 w - - 0 1',
          description: { ru: 'Поставить мат за 30 ходов. Белые при точной игре должны сделать ничью', en: 'Checkmate in 30 moves. White must make a draw with accurate play' },
          orientation: 'white',
          id: '587e9e2a-72c1-47c1-9592-884c371c6d94',
          rules: KidsConst.RULES_CHESS | KidsConst.RULES_BLACK_MATE_IN_X | (30 << (Math.log2(KidsConst.RULES_BLACK_MATE_IN_X)+1)),
        },
        { 
          title: {ru: 'Белый гном', en: "White gnome"},
          fen: '4k3/8/8/8/8/4P3/8/4K3 w - - 0 1',
          description: { ru: 'Поставить мат за 30 ходов. Черные при точной игре должны сделать ничью', en: 'Checkmate in 30 moves. Black must make a draw with accurate play' },
          orientation: 'white',
          id: '9e8c1f8c-6836-48c5-ac8d-33f617f67d27',
          rules: KidsConst.RULES_CHESS | KidsConst.RULES_WHITE_MATE_IN_X | (30 << (Math.log2(KidsConst.RULES_BLACK_MATE_IN_X)+1)),
        },
        { 
          title: {ru: 'Королевская битва', en: "King's battle"},
          fen: '4k3/1p3ppp/8/8/8/8/PPP3P1/4K3 w - - 0 1',
          description: { ru: 'Игра до мата', en: 'Play until checkmate' },
          orientation: 'white',
          id: '9f631328-356e-4af9-a57e-a11a42ce8fe9',
        },
        { 
          title: {ru: 'Королевская битва 2', en: "King's battle 2"},
          fen: '4k3/pp3ppp/8/8/8/8/PPP3PP/4K3 w - - 0 1',
          description: { ru: 'Игра до мата', en: 'Play until checkmate' },
          orientation: 'white',
          id: 'de802da2-dc42-4266-a4e7-87ea7af3869c',
        },
        { 
          title: {ru: 'Могучие короли', en: "Mighty kings"},
          fen: '4k1n1/pppppppp/8/8/8/8/PPPPPPPP/2B1K3 w - - 0 1',
          description: { ru: 'Игра до мата', en: 'Play until checkmate' },
          orientation: 'white',
          id: '80136555-479a-4bca-8461-0abdb1704d0e',
        },
        { 
          title: {ru: 'Могучие короли 2', en: "Mighty kings 2"},
          fen: '4k1n1/pppppppp/8/8/8/8/PPPPPPPP/4KB2 w - - 0 1',
          description: { ru: 'Игра до мата', en: 'Play until checkmate' },
          orientation: 'white',
          id: '9202e01b-2fc3-42e4-9a15-8f6d40ebd3cd',
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
    cartoon: { 
      white: require("@/assets/img/027-panda bear.svg"), 
      black: require("@/assets/img/010-cat.svg"), 
    },
    rules: KidsConst.RULES_CHESS,
    difficulty: 2,
  },

};

export default new Vuex.Store({
  strict: debug,
  state,
  getters,
  mutations,
  actions,
});
