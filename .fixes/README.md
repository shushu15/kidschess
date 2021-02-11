# kidschess fixes for vue-chessboard component

Needs to fix error in chess.js for non-king positions

 in /node_modules/vue-chessboard/dist/
 files 
 vue-chessboard.browser.js
 vue-chessboard.common.js
 
  function king_attacked(color) {
    // shu: fix No-King position
    if (kings[color] == EMPTY) {
      return false;
    }
    return attacked(swap_color(color), kings[color]);
  } 
  