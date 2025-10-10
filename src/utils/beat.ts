/**
 * Beat-related utility functions and constants
 */

import { DURATIONS, DYNAMICS, ORNAMENTS, isTripletDuration } from '@/types';
import { isValidDifficultyLevel } from './difficulty';
import type {
	DisplayMeasure,
	DisplayUnit,
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

/**
 * Converts a measure into display units by combining notes into beamed pairs when appropriate
 * Supports: eighth + eighth (n), dotted eighth + sixteenth (o), sixteenth + dotted eighth (O), triplets (T, t)
 */
export const createDisplayMeasure = (measure: Measure): DisplayMeasure => {
	const result: DisplayUnit[] = [];
	const BEAT_LENGTH = 24;
	let i = 0;

	while (i < measure.length) {
		const currentNote = measure[i]!;
		const isOnDownbeat = currentNote.start % BEAT_LENGTH === 0;
		const nextNote = i + 1 < measure.length ? measure[i + 1]! : null;
		const thirdNote = i + 2 < measure.length ? measure[i + 2]! : null;

		// Check for triplet patterns (3 consecutive notes/rests with same triplet duration starting on downbeat)
		if (
			isOnDownbeat &&
			nextNote &&
			thirdNote &&
			isTripletDuration(currentNote.dur) &&
			currentNote.dur === nextNote.dur &&
			currentNote.dur === thirdNote.dur &&
			nextNote.start === currentNote.start + currentNote.dur &&
			thirdNote.start === nextNote.start + nextNote.dur
		) {
			// Count notes and rests
			const isNote1 = !currentNote.isRest;
			const isNote2 = !nextNote.isRest;
			const isNote3 = !thirdNote.isRest;
			const noteCount = (isNote1 ? 1 : 0) + (isNote2 ? 1 : 0) + (isNote3 ? 1 : 0);

			// Pattern: --- (all rests) → Convert to quarter rest
			if (noteCount === 0) {
				result.push({
					type: 'single',
					note: {
						start: currentNote.start,
						dur: 24,
						isRest: true,
					},
				});
				i += 3;
				continue;
			}

			// Pattern: +-- (note, rest, rest) → Convert to quarter note
			if (isNote1 && !isNote2 && !isNote3) {
				result.push({
					type: 'single',
					note: {
						...currentNote,
						dur: 24,
					},
				});
				i += 3;
				continue;
			}

			// Pattern: +++ (all notes) → Display as T or t
			if (noteCount === 3) {
				const symbol = currentNote.dur === 8 ? 'T' : 't';
				const className = currentNote.dur === 8 ? 'isEighthTriplet' : 'isQuarterTriplet';

				result.push({
					type: 'triplet',
					notes: [currentNote, nextNote, thirdNote],
					start: currentNote.start,
					symbol,
					className,
				});
				i += 3;
				continue;
			}

			// Mixed patterns (1 or 2 notes with rests)
			// -+- : Ò, --+ : ¤, ++- : Ó, +-+ : Ñ, -++ : Õ
			let symbol: string;
			if (!isNote1 && isNote2 && !isNote3) {
				symbol = 'Ò'; // -+-
			} else if (!isNote1 && !isNote2 && isNote3) {
				symbol = '¤'; // --+
			} else if (isNote1 && isNote2 && !isNote3) {
				symbol = 'Ó'; // ++-
			} else if (isNote1 && !isNote2 && isNote3) {
				symbol = 'Ñ'; // +-+
			} else if (!isNote1 && isNote2 && isNote3) {
				symbol = 'Õ'; // -++
			} else {
				// Fallback (shouldn't happen)
				symbol = currentNote.dur === 8 ? 'T' : 't';
			}

			const className = currentNote.dur === 8 ? 'isEighthTriplet' : 'isQuarterTriplet';

			result.push({
				type: 'triplet',
				notes: [currentNote, nextNote, thirdNote],
				start: currentNote.start,
				symbol,
				className,
			});
			i += 3;
			continue;
		}

		// Check for beamable patterns
		if (nextNote && !currentNote.isRest && !nextNote.isRest && isOnDownbeat) {
			const isConsecutive = nextNote.start === currentNote.start + currentNote.dur;

			// Pattern: dotted eighth (18) + sixteenth (6) = 'o' symbol
			if (currentNote.dur === 18 && nextNote.dur === 6 && isConsecutive) {
				result.push({
					type: 'beamed',
					notes: [currentNote, nextNote],
					start: currentNote.start,
					symbol: 'o',
					className: 'is4Sixteenths',
				});
				i += 2;
				continue;
			}

			// Pattern: sixteenth (6) + dotted eighth (18) = 'O' symbol
			if (currentNote.dur === 6 && nextNote.dur === 18 && isConsecutive) {
				result.push({
					type: 'beamed',
					notes: [currentNote, nextNote],
					start: currentNote.start,
					symbol: 'O',
					className: 'is4Sixteenths',
				});
				i += 2;
				continue;
			}

			// Pattern: eighth (12) + eighth (12) = 'n' symbol
			if (currentNote.dur === 12 && nextNote.dur === 12 && isConsecutive) {
				result.push({
					type: 'beamed',
					notes: [currentNote, nextNote],
					start: currentNote.start,
					symbol: 'n',
					className: 'is2Eigths',
				});
				i += 2;
				continue;
			}
		}

		// Check if this is a syncopated pattern with original notes stored
		if (
			currentNote.symbolOverride &&
			['š', 'm', 'o'].includes(currentNote.symbolOverride) &&
			currentNote.originalNotes &&
			currentNote.originalNotes.length === 3
		) {
			result.push({
				type: 'syncopated',
				notes: currentNote.originalNotes,
				start: currentNote.start,
				symbol: currentNote.symbolOverride,
				className: 'is4Sixteenths',
			});
			i += 1;
			continue;
		}

		// No beaming - create a single note display
		result.push({
			type: 'single',
			note: currentNote,
		});
		i += 1;
	}

	return result;
};
