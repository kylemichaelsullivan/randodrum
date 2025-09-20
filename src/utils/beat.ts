/**
 * Beat-related utility functions and constants
 */

import { isValidDifficultyLevel } from './difficulty';
import type { Duration, Dynamic, GeneratedBeat, Measure, Note, NoteStart, Ornament } from '@/types';

// Constants
export const DURATIONS: readonly Duration[] = [6, 8, 12, 16, 18, 24, 36, 48, 72, 96] as Duration[];

export const DYNAMICS: readonly Dynamic[] = ['ghost', 'normal', 'accent', 'rimshot'] as const;

export const ORNAMENTS: readonly Ornament[] = ['flam', 'drag', null] as const;

// Helper functions
export const createNoteStart = (value: number): NoteStart => {
	if (value < 0) {
		throw new Error('Note start time must be non-negative');
	}
	return value as NoteStart;
};

// Type guards
export const isValidDynamic = (value: string): value is Dynamic =>
	DYNAMICS.includes(value as Dynamic);

export const isValidDuration = (value: number): value is Duration =>
	DURATIONS.includes(value as Duration);

export const isValidGeneratedBeat = (value: unknown): value is GeneratedBeat => {
	if (typeof value !== 'object' || value === null) return false;

	const beat = value as Record<string, unknown>;

	return (
		Array.isArray(beat.measures) &&
		beat.measures.every(isValidMeasure) &&
		typeof beat.beatsPerMeasure === 'number' &&
		beat.beatsPerMeasure >= 1 &&
		beat.beatsPerMeasure <= 16 &&
		isValidDifficultyLevel(beat.difficulty as string)
	);
};

export const isValidMeasure = (value: unknown): value is Measure => {
	return Array.isArray(value) && value.every(isValidNote);
};

export const isValidNote = (value: unknown): value is Note => {
	if (typeof value !== 'object' || value === null) return false;

	const note = value as Record<string, unknown>;

	return (
		typeof note.start === 'number' &&
		note.start >= 0 &&
		isValidDuration(note.dur as number) &&
		typeof note.isDominant === 'boolean' &&
		isValidDynamic(note.dynamic as string) &&
		isValidOrnament(note.ornament as string | null)
	);
};

export const isValidOrnament = (value: string | null): value is Ornament =>
	ORNAMENTS.includes(value as Ornament);
