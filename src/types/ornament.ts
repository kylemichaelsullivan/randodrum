/**
 * Drum ornament type definitions
 */

// Ornament name constants (precise type)
export type OrnamentName = 'flam' | 'drag' | null;

// Ornament type alias
export type Ornament = OrnamentName;

// Ornament configuration type
export type OrnamentConfig = {
	name: OrnamentName;
	symbol: string;
};
