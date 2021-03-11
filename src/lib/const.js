export const HUMAN = 1;
export const ROBOT = 2;
export const RULES_CHESS            = 1;
export const RULES_MATERIAL_WIN     = 2;
export const RULES_STALEMATE_WIN    = 4;
export const RULES_3_REPETITION     = 8;
export const RULES_SAFE_PROMOTION   = 16;
export const RULES_DEFAULT = RULES_SAFE_PROMOTION | RULES_STALEMATE_WIN;

