/**
 * Core beat generation types
 */

import type { DifficultyLevel } from './difficulty';
import type { Duration } from './duration';
import type { Dynamic } from './dynamic';
import type { Ornament } from './ornament';

// Beat form data type
export type BeatFormData = {
	beats: number;
	difficulty: DifficultyLevel;
	measures: number;
};

// Exercise type (collection of measures)
export type Exercise = Measure[];

// Generated beat type
export type GeneratedBeat = {
	beatsPerMeasure: number;
	difficulty: DifficultyLevel;
	measures: Measure[];
};

// Measure type (one bar - sum(dur) = gridSize)
export type Measure = Note[];

// Note type definition
export type Note = {
	dynamic: Dynamic;
	dur: Duration;
	isDominant: boolean;
	ornament: Ornament;
	start: number;
};

// Stricter type for note start times (must be non-negative)
export type NoteStart = number & { readonly __brand: 'NoteStart' };

// Samples type for storing beat patterns
export type Samples = Record<string, Measure[]>;
