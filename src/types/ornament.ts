/**
 * Drum ornament type definitions
 */

export const ORNAMENTS = ['Flam', 'Drag', null] as const;

export type OrnamentName = (typeof ORNAMENTS)[number];
export type Ornament = OrnamentName;
export type OrnamentConfig = {
	name: Exclude<OrnamentName, null>;
};
