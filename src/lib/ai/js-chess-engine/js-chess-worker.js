import Board from './Board.mjs';
import { getFEN } from './utils.mjs';


let board = null;   // store Board object between calls

onmessage = function(e) {

    let uci = {};
  
    uci.data = e.data;
    uci.message = uci.data.replace(/(\r\n|\n|\r)/gm,"");
    uci.message = uci.message.trim();
    uci.message = uci.message.replace(/\s+/g,' ');
    uci.tokens  = uci.message.split(' ');
    uci.command = uci.tokens[0];
    if (uci.command) {

      if (uci.command == 'u')
        uci.command = 'ucinewgame';
        
      if (uci.command == 'b')
        uci.command = 'board';
        
      if (uci.command == 'q')
        uci.command = 'quit';
        
      if (uci.command == 'p') {
        uci.command = 'position';
        if (uci.tokens[1] == 's') {
          uci.tokens[1] = 'startpos';
        }
      }
        
      if (uci.command == 'g') {
        uci.command = 'go';
        if (uci.tokens[1] == 'd') {
          uci.tokens[1] = 'depth';
        }
      }
    }
        
    switch (uci.command) {

    case 'position':
      //{{{  position
      if (uci.tokens[1] == 'fen') {
        let fen = uci.tokens.slice(2).join(' ');
        postMessage(`worker fen ${fen}`);
        board = new Board(fen);
        postMessage(getFEN(board.configuration));
      }    
      break;
              
              //}}}
        
      case 'go':        
        if (uci.tokens[1] == 'depth') {
          let level = parseInt(uci.tokens[2], 10);
          if (level < 6) 
            level = 2;
          else
            level = 3;  
          const moveObj = board.calculateAiMove(level);
          if (moveObj) {
            const moveRep = `bestmove ${moveObj.from.toLowerCase()}${moveObj.to.toLowerCase()}`;
            postMessage(moveRep);
          } else
            postMessage('bestmove');
        }  
        break;
      }      
    
};
