/**
 * Core beat generation types
 */

import type { DifficultyLevel } from './difficulty';
import type { Duration } from './duration';
import type { DynamicName } from './dynamic';
import type { OrnamentName } from './ornament';

export type BeatFormData = {
	beats: number;
	difficulty: DifficultyLevel;
	measures: number;
};

export type GeneratedBeat = {
	beatsPerMeasure: number;
	difficulty: DifficultyLevel;
	measures: Measure[];
};

// Measure type (one bar - sum(dur) = gridSize)
export type Measure = Note[];

export type Note = {
	dur: Duration;
	start: number;
	isRest: boolean;
	dynamic?: DynamicName; // Not needed for rests
	isDominant?: boolean; // Not needed for rests
	ornament?: OrnamentName; // Not needed for rests
	symbolOverride?: string; // Special symbols for combined note patterns (M, O, š, m, o)
	originalNotes?: [Note, Note, Note]; // For syncopated patterns (š, m, o), stores the 3 original notes
};

export type NoteStart = number & { readonly __brand: 'NoteStart' };

// Base type for all grouped note patterns (beamed, syncopated, triplet)
type NotePattern<T extends string, N extends readonly Note[]> = {
	type: T;
	notes: N;
	start: number;
	symbol: string;
	className: string;
};

// Specific pattern types with fixed note counts and display info
export type BeamedNotePair = NotePattern<'beamed', [Note, Note]>; // Two notes beamed together (e.g., 'n', 'o', 'O')
export type SyncopatedPattern = NotePattern<'syncopated', [Note, Note, Note]>; // Three notes in syncopated pattern (e.g., 'š', 'm', 'o')
export type TripletPattern = NotePattern<'triplet', [Note, Note, Note]>; // Three notes in a triplet group (e.g., 'T', 't')

export type SingleNoteDisplay = {
	type: 'single';
	note: Note;
};

export type DisplayUnit = SingleNoteDisplay | BeamedNotePair | SyncopatedPattern | TripletPattern;
export type DisplayMeasure = DisplayUnit[];
