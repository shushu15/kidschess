import { openDB } from 'idb';
/**
 * games_played store fields:
 *  gameID - String - (gameID from KidsChess games)
 *  nStarted - Number - number of games started
 *  nCompleted - Number - number of games finished
 *  nToPrize - Number - number of games finished from last prize
 *  lastPlayed - Date.now() - date of last played (maybe only date, not time)
 *  prizeCounter - how many prizes with this leading game
 *  WB - balance of white/black games for prize, W +1, B -1. Used to count coeff
 *  
 * prizes store fields
 *  prize - prize type
 *  color - prize color
 *  gameID - most points gathered from this game
 *  dateIssued - Date of this prize issued
 */

let db;
let counterPrize = 0;
const dbName = 'kidschess-db';
const storeGames = 'games_played';
const storePrizes = 'prizes';
const SUM_TO_PRIZE = [3,5,7];
// const ONE_GAME_COEFF = 0.5; // coeff to reduce repeating game prizes (with multiply on prizes for this game)
export const DB_OFF = -2;
export const DB_ERR = -1;
export const DB_NOTFOUND = 0;
export const DB_OK = 1;

const listPrizes = ['mdiStar','mdiStarFace','mdiStarFourPoints','mdiShieldStar','mdiFlowerTulip','mdiFlower','mdiFlowerPoppy','mdiChessKing','mdiChessQueen','mdiBell','mdiRocket','mdiAirplane','mdiBird','mdiCarConvertible','mdiEmoticonCoolOutline','mdiHeart','mdiCat','mdiDog'];
const listColors = ['red','pink','purple','deep-purple','indigo','blue','light-blue','cyan','teal','green','light-green','lime','yellow','amber','orange','deep-orange','brown'];
/* const cacheValid = {
  storeGames: false,
  storePrizes: false,
}*/

export function getDB() {
  return db;
}
export async function init(){
  // Set up the database
  let res =  DB_ERR;
  if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB'); // eslint-disable-line no-console
    return DB_NOTFOUND;
  }  
  try {
    db = await openDB(dbName, 2, {
      upgrade(db, oldVersion, newVersion, transaction) {
        if (!db.objectStoreNames.contains(storeGames))
          db.createObjectStore(storeGames, { keyPath: "gameID" });
        if (!db.objectStoreNames.contains(storePrizes))
          db.createObjectStore(storePrizes, {autoIncrement: true});
        if (oldVersion===1 && newVersion===2) {
          transaction.done.then(()=> {res = migrate_1_2(db);});
        }  
      },
    });
    res =  DB_OK;
  } catch(err) {
    console.log(`db init ${err.toString()}`); // eslint-disable-line no-console
  }
  return res;  
}
/*******
 * @param gameID - String id from tasks[] in store, the current game id
 * @param side - true: WHITE, false: BLACK
 */
export async function startGame(gameID){
  let res =  DB_ERR;
  try {
    let result = await db.get(storeGames, gameID);
    //fill result with initial values if returned no results
    if (!result) {
      result = {gameID:gameID, nStarted:0, nCompleted:0, nToPrize:0, lastPlayed:undefined, prizeCounter:0, WB:0};
    }
    result.nStarted++;
    result.lastPlayed = Date.now();
    await db.put(storeGames, result);
    res =  DB_OK;
    // console.log(`db startGame ${typeof result === 'object'? JSON.stringify(result): result}`);
  } catch(err) {
    console.log(`db startGame catch error ${err.toString()}`); // eslint-disable-line no-console
  }
  // console.log(`db startGame res=${res}`);
  return res;  
}

/*******
 * @param gameID - String id from tasks[] in store, the current game id
 * @param side - true: WHITE, false: BLACK
 */
 export async function finishGame(gameID, side){
  let res =  DB_ERR;
  try {
    let result = await db.get(storeGames, gameID);
    if (!result) { // in the case of switching storing in the middle of the game TODO - reinit database
      // console.log(`db finishGame NOF ${result}`);
      result = {gameID:gameID, nStarted:1, nCompleted:0, nToPrize:0, lastPlayed:undefined, prizeCounter:0, WB:0};
    }
    result.nCompleted++;
    result.nToPrize++;
    result.lastPlayed = Date.now();
    result.WB += side? 1: -1; // for WHITE we +1 for BLACK -1
    await db.put(storeGames, result);
    res =  DB_OK;
    // console.log(`db finishGame ${typeof result === 'object'? JSON.stringify(result): result}`);
  } catch(err) {
    console.log(`db finishGame catch error ${err.toString()}`); // eslint-disable-line no-console
  }
  // console.log(`db finishGame res=${res}`);
  return res;  
}

/**
 * List all played games
 */
 export async function getGames(){
  let res =  DB_ERR;
  let result = [];
  // if (cache.length > 0) {
  //  result = cache;
  //  res = DB_OK;
  // } else {
    try {
      result = await db.getAll(storeGames);
      if (result) {
        res = DB_OK;
        // result.forEach(element => cache.push(element)); // due to reactivity we need on-element adding
        // cache.stickers = result;
      }
      else 
        res =  DB_NOTFOUND;
    } catch(err) {
      console.log(`db getGames ${err.toString()}`); // eslint-disable-line no-console
    }
  // }
  return res === DB_OK? result: res;  
}

/**
 * @param cache  dbCache.stickers
 */
export async function getPrizes(){
  let res =  DB_ERR;
  let result = [];
  // if (cache.length > 0) {
  //  result = cache;
  //  res = DB_OK;
  // } else {
    try {
      result = await db.getAll(storePrizes);
      if (result) {
        // save the number of prizes for the future scoring 
        counterPrize = result.length;
        res = DB_OK;
        // result.forEach(element => cache.push(element)); // due to reactivity we need on-element adding
        // cache.stickers = result;
      }
      else 
        res =  DB_NOTFOUND;
    } catch(err) {
      console.log(`db getPrizes ${err.toString()}`); // eslint-disable-line no-console
    }
  // }
  return res === DB_OK? result: res;  
}

/**
 * @param cache  dbCache.stickers
 */
 export async function checkForPrize() {
  let res =  DB_ERR;
  let prize = DB_NOTFOUND;
  try {
    let nMaxGame, nToPrizeMax = 0, nToPrizeSum = 0;
    let cursor = await db.transaction(storeGames).store.openCursor();
    while (cursor) {   
      let nToPrize = Math.round(cursor.value.nToPrize / (cursor.value.prizeCounter * recountCoeff(cursor.value.nToPrize, cursor.value.WB===undefined? 0: cursor.value.WB) + 1)); // we count games played for prize div by the number of issued prizes with coeff for this game
      // search for the game played most from last prize
      if (nToPrize > nToPrizeMax) {
        nToPrizeMax = nToPrize;
        nMaxGame = cursor.value.gameID;
      }
      nToPrizeSum += nToPrize;
      // console.log(cursor.key, cursor.value);
      cursor = await cursor.continue();
    }
    // console.log(`checkForPrize nToPrizeSum=${nToPrizeSum}`);
    if (nToPrizeSum >= sumToPrize())  { // add a prize
      prize = {prize: listPrizes[getRandomInt(listPrizes.length)], color: listColors[getRandomInt(listColors.length)], gameID: nMaxGame, dateIssued: Date.now()};
      await db.add(storePrizes, prize);
      // update cache - we can reQuery database or add it to cache manually 
      // for now I'mm adding just to cache
      // cache.push(prize);

      // cursor to clear prizeCounters
      cursor = await db.transaction(storeGames, "readwrite").store.openCursor();
      while (cursor) {
        let record = cursor.value;
        if (record.nToPrize > 0 || record.gameID === nMaxGame) {
          record.nToPrize = 0;
          record.WB = 0;
          record.prizeCounter++;
          await cursor.update(record);
        }
        cursor = await cursor.continue();
      }
      res = DB_OK;
    } else res = DB_NOTFOUND;   
  } catch(err) {
    console.log(`db checkForPrize ${err.toString()}`); // eslint-disable-line no-console
  }
  return res === DB_OK? prize: res;  

}
/****
 * GameID - the current game
 * for testing
 */
export async function forcePrize(gameID, dateIssued) {
  let res =  DB_ERR;
  let prize = DB_NOTFOUND;
  try {
      prize = {prize: listPrizes[getRandomInt(listPrizes.length)], color: listColors[getRandomInt(listColors.length)], gameID: gameID, dateIssued: dateIssued? dateIssued: Date.now()};
      await db.add(storePrizes, prize);
      res = DB_OK;
  } catch(err) {
    console.log(`db forcePrize ${err.toString()}`); // eslint-disable-line no-console
  }
  return res === DB_OK? prize: res;  

}
/*
export function cachedStickers() {
  return cache.stickers;
}
*/

export async function close() {
  db.close();
}
/*
export function clearCache() {
  while(cache.stickers.length > 0) cache.stickers.pop(); // = undefined;
}
*/
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
/********
 * how many different games need to play to get prize
 */
function sumToPrize() {
  // return counterPrize===0? SUM_TO_PRIZE[0]: counterPrize<3? SUM_TO_PRIZE[1]: SUM_TO_PRIZE[2];
  let c=counterPrize===0? SUM_TO_PRIZE[0]: counterPrize<3? SUM_TO_PRIZE[1]: SUM_TO_PRIZE[2];
  // console.log(`sumToPrize ${c}`); // eslint-disable-line no-console
  return c;
}
/*****
 * @param int balance "+ more WHITE games, "-" more BLACK games, 0 equal for prize
 * @param int total - total number of played games for prize
 * 
 * balance: W - B, total: W + B, example total==100 balance==50, thus W==75, B==25, so 0.5 is a good threshold
 */
function recountCoeff(total, balance) {
  // need to translate 1 .. 0 to say 0.6 .. 0.1 
  let c = (total===0? 0: Math.abs(balance) / total / 2)  + 0.1;
  // console.log(`recountCoeff ${c}`); // eslint-disable-line no-console
  return  c;
}

/*jshint -W119 */
async function migrate_1_2(db) {
/*jshint +W119 */
  let res =  DB_ERR;
  try {
    let cursor = await db.transaction(storeGames, "readwrite").store.openCursor();
    while (cursor) {
      let record = cursor.value;
      if (record.WB === undefined) {
        record.WB = 0;
        await cursor.update(record);
      }
      cursor = await cursor.continue();
    }
    console.log('db migrate_1_2 ok'); // eslint-disable-line no-console
    res = DB_OK;
  } catch(err) {
    console.log(`db migrate_1_2 error ${err.toString()}`); // eslint-disable-line no-console
  }
  return res;

}


