/**
 * Beat-related utility functions and constants
 */

import { DURATIONS, DYNAMICS, ORNAMENTS } from '@/types';
import { isValidDifficultyLevel } from './difficulty';
import type {
	DynamicName,
	Duration,
	GeneratedBeat,
	Measure,
	Note,
	NoteStart,
	OrnamentName,
} from '@/types';

export { DYNAMICS, ORNAMENTS };

export const createNoteStart = (value: number): NoteStart => {
	if (value < 0) {
		throw new Error('Note start time must be non-negative');
	}
	return value as NoteStart;
};

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
		DURATIONS.includes(note.dur as Duration) &&
		typeof note.isDominant === 'boolean' &&
		DYNAMICS.includes(note.dynamic as DynamicName) &&
		ORNAMENTS.includes(note.ornament as OrnamentName)
	);
};
