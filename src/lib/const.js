export const HUMAN = 1;
export const ROBOT = 2;
export const RULES_CHESS            = 1;
export const RULES_MATERIAL_WIN     = 2;
export const RULES_STALEMATE_WIN    = 4;
export const RULES_3_REPETITION     = 8;
export const RULES_SAFE_PROMOTION   = 16;
export const RULES_WHITE_MATE_IN_X       = 64; // 
export const RULES_BLACK_MATE_IN_X       = 128; // next 5 bits used for the number of moves (max = 31), >> (RULES_BLACK_MATE_IN_X+1)
export const MASK_MATE_IN_X       = 31; // mask for the number of moves
export const RULES_NEXT_EMPTY       = 8192; // first empty bit after the number of moves

export const RULES_DEFAULT = RULES_SAFE_PROMOTION | RULES_STALEMATE_WIN;

export const QUEEN_WEIGHT = 8;
export const ROOK_WEIGHT =  5;
export const BISHOP_WEIGHT = 3;
export const KNIGHT_WEIGHT = 3;

export const WHITE = 'white';
export const BLACK = 'black';

export const THINKING_DELAY = 2000;
export const THINKING_LEVEL = 14;

export const MOVETIME = 10000;
export const AUTO = 'auto';

export const TYPE_NONE = 0;
export const TYPE_POSITIVE = 1;
export const TYPE_NEGATIVE = 2;




