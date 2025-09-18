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
	| 'Dotted Sixteenth'
	| 'Sixteenth'
	| 'Thirty-Second'
	| 'Quarter Triplet'
	| 'Eighth Triplet'
	| 'Eighth Sixtuplet'
	| 'Sixteenth Sixtuplet';

// Note type configuration
export type NoteType = {
	name: NoteTypeName;
	value: number;
};
