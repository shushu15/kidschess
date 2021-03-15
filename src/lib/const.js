export const HUMAN = 1;
export const ROBOT = 2;
export const RULES_CHESS            = 1;
export const RULES_MATERIAL_WIN     = 2;
export const RULES_STALEMATE_WIN    = 4;
export const RULES_3_REPETITION     = 8;
export const RULES_SAFE_PROMOTION   = 16;
export const RULES_MATE_IN_X       = 64; // next 5 bits used for the number of moves (max - 31), >> 7
export const RULES_NEXT_EMPTY       = 4096; // first empty bit after the number of moves

export const RULES_DEFAULT = RULES_SAFE_PROMOTION | RULES_STALEMATE_WIN;

export const QUEEN_WEIGHT = 8;
export const ROOK_WEIGHT =  5;
export const BISHOP_WEIGHT = 3;
export const KNIGHT_WEIGHT = 3;

export const WHITE = 'white';
export const BLACK = 'black';

