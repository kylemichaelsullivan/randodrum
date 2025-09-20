/**
 * Drum ornament type definitions
 */

export const ORNAMENTS = ['flam', 'drag', null] as const;

export type OrnamentArray = typeof ORNAMENTS;
export type OrnamentName = OrnamentArray[number];

export type Ornament = OrnamentName;

export type OrnamentConfig = {
	name: OrnamentName;
	symbol: string;
};
