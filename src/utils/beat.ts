/**
 * Beat-related utility functions and constants
 */

import { DYNAMICS } from '@/types/dynamic';
import { isValidDifficultyLevel } from './difficulty';
import { ORNAMENTS } from '@/types/ornament';
import { STRAIGHT_DURATIONS, DOTTED_DURATIONS, TRIPLET_DURATIONS } from '@/types/duration';
import type { Duration, Dynamic, GeneratedBeat, Measure, Note, NoteStart, Ornament } from '@/types';

export const DURATIONS: readonly Duration[] = [
	...STRAIGHT_DURATIONS,
	...TRIPLET_DURATIONS,
	...DOTTED_DURATIONS,
] as Duration[];

export { DYNAMICS, ORNAMENTS };

export const createNoteStart = (value: number): NoteStart => {
	if (value < 0) {
		throw new Error('Note start time must be non-negative');
	}
	return value as NoteStart;
};

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
