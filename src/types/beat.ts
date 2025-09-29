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
};

export type NoteStart = number & { readonly __brand: 'NoteStart' };
