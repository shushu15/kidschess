import { openDB } from 'idb';
/**
 * games_played store fields:
 *  gameID - String - (gameID from KidsChess games)
 *  nStarted - Number - number of games started
 *  nCompleted - Number - number of games finished
 *  nToPrize - Number - number of games finished from last prize
 *  lastPlayed - Date.now() - date of last played (maybe only date, not time)
 *  prizeCounter - how many prizes with this leading game
 *  
 * prizes store fields
 *  id - key
 *  prize - prize type
 *  color - prize color
 *  gameID - most points gathered from this game
 *  dateIssued - Date of this prize issued
 */

let db;
const dbName = 'cr1-db';
const storeGames = 'games_played';
const storePrizes = 'prizes';
const SUM_TO_PRIZE = 11;
export const DB_ERR = -1;
export const DB_NOTFOUND = 0;
export const DB_OK = 1;

const listPrizes = ['mdiStar','mdiStarFace','mdiStarFourPoints','mdiShieldStar','mdiFlowerTulip','mdiFlower','mdiFlowerPoppy','mdiChessKing','mdiChessQueen','mdiBell','mdiRocket','mdiAirplane','mdiCandy','mdiEmoticonCoolOutline','mdiHeart'];
const listColors = ['red','pink','purple','deep-purple','indigo','blue','light-blue','cyan','teal','green','light-green','lime','yellow','amber','orange','deep-orange','brown','blue-grey'];

export async function init(){
  // Set up the database
  let res =  DB_ERR;
  if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
    return DB_NOTFOUND;
  }  
  try {
    db = await openDB(dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(storeGames))
          db.createObjectStore(storeGames, { keyPath: "gameID" });
      },
    });
    res =  DB_OK;
  } catch(err) {
    console.log(`db init ${err.toString()}`);
  }
  return res;  
}
export async function startGame(gameID){
  let res =  DB_ERR;
  try {
    let result = await db.get(storeGames, gameID);
    //fill result with initial values if returned no results
    if (!result) {
      result = {gameID:gameID, nStarted:0, nCompleted:0, nToPrize:0, lastPlayed:undefined, prizeCounter:0};
    }
    result.nStarted++;
    result.lastPlayed = Date.now();
    await db.put(storeGames, result);
    res =  DB_OK;
  } catch(err) {
    console.log(`db startGame ${err.toString()}`);
  }
  return res;  
}

export async function finishGame(gameID){
  let res =  DB_ERR;
  try {
    let result = await db.get(storeGames, gameID);
    if (result) {
      result.nComplete++;
      result.nToPrize++;
      result.lastPlayed = Date.now();
      await db.put(storeGames, result);
      res =  DB_OK;
    } else res =  DB_NOTFOUND;
  } catch(err) {
    console.log(`db finishGame ${err.toString()}`);
  }
  return res;  
}

export async function getPrizes(){
  let res =  DB_ERR;
  let result = [];
  try {
    result = await db.getAll(storePrizes);
    if (result)
      res = DB_OK;
    else 
      res =  DB_NOTFOUND;
  } catch(err) {
    console.log(`db getPrizes ${err.toString()}`);
  }
  return res === DB_OK? result: res;  
}

export async function checkForPrize() {
  let res =  DB_ERR;
  let prize = DB_NOTFOUND;
  try {
    let nMaxGame, nToPrizeMax = 0, nToPrizeSum = 0;
    let cursor = await db.transaction(storeGames).store.openCursor();
    while (cursor) {   
      let nToPrize = cursor.value.nToPrize / (cursor.value.prizeCounter + 1); // we count games played for prize div by the number of issued prizes for this game
      if (nToPrize > nToPrizeMax) {
        nToPrizeMax = nToPrize;
        nMaxGame = cursor.value.gameID;
      }
      nToPrizeSum += nToPrize;
      // console.log(cursor.key, cursor.value);
      cursor = await cursor.continue();
    }
    if (nToPrizeSum >= SUM_TO_PRIZE)  { // add a prize
      prize = {prize: listPrizes[getRandomInt(listPrizes.length)], color: listColors[getRandomInt(listColors.length)], gameID: nMaxGame, dateIssued: Date.now()};
      await db.add(storePrizes, prize);

      // cursor to clear prizeCounters
      cursor = await db.transaction(storeGames).store.openCursor();
      while (cursor) {
        let record = cursor.value;
        if (record.prizeCounter > 0) {
          record.prizeCounter = 0;
          await cursor.update(record);
        }
        cursor = await cursor.continue();
      }
      res = DB_OK;
    } else res = DB_NOTFOUND;   
  } catch(err) {
    console.log(`db checkForPrize ${err.toString()}`);
  }
  return res === DB_OK? prize: res;  

}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

