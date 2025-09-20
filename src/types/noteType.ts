/**
 * Note type definitions for drum notation
 */

// Note type name constants
export type NoteTypeName =
	| 'Whole'
	| 'Dotted Half'
	| 'Half'
	| 'Dotted Quarter'
	| 'Quarter'
	| 'Dotted Eighth'
	| 'Eighth'
	| 'Sixteenth'
	| 'Quarter Triplet'
	| 'Eighth Triplet';

// Note type configuration
export type NoteType = {
	name: NoteTypeName;
	value: number;
};
