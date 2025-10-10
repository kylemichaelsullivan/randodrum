import { getDifficultyConfig } from '@/utils';
import { isTripletDuration } from '@/types';

import type {
	BeatFormData,
	DifficultyConfig,
	Duration,
	DurationWeightConfig,
	DynamicName,
	DynamicThresholds,
	GeneratedBeat,
	Measure,
	Note,
} from '@/types';
import type { OrnamentName } from '@/types';

function pickWeightedDuration(durationConfigs: DurationWeightConfig[], cap: number): Duration {
	const validConfigs = durationConfigs.filter(config => config.duration <= cap);
	if (validConfigs.length === 0) return 6;

	// Normalize weights so they sum to 1.0
	const explicitWeights = validConfigs.filter(config => config.weight !== undefined);
	const implicitWeights = validConfigs.filter(config => config.weight === undefined);

	const explicitTotal = explicitWeights.reduce((sum, config) => sum + config.weight!, 0);
	const remainingWeight = 1.0 - explicitTotal;
	const implicitWeightEach =
		implicitWeights.length > 0 ? remainingWeight / implicitWeights.length : 0;

	const normalizedConfigs = validConfigs.map(config => ({
		...config,
		weight: config.weight ?? implicitWeightEach,
	}));

	let random = Math.random();

	for (const config of normalizedConfigs) {
		random -= config.weight;
		if (random <= 0) return config.duration;
	}
	return validConfigs[validConfigs.length - 1]!.duration;
}

function sampleFromDist(dist: Record<number, number>, cap: number): number {
	const items = Object.entries(dist)
		.map(([k, w]) => ({ len: Number(k), w: Number(w) }))
		.filter(x => x.len <= cap);

	if (items.length === 0) return 6;

	const total = items.reduce((s, x) => s + x.w, 0);
	let r = Math.random() * total;
	for (const it of items) {
		if ((r -= it.w) <= 0) return it.len;
	}
	return items[items.length - 1]!.len;
}

export function generateRhythm(
	durationConfigs: DurationWeightConfig[],
	measureLen: number,
	restProbability = 0
): Measure {
	const m: Measure = [];
	let t = 0;

	while (t < measureLen) {
		const remaining = measureLen - t;
		const dur = pickWeightedDuration(durationConfigs, remaining);

		// Create a rest object if random value is below threshold
		if (Math.random() < restProbability) {
			m.push({
				start: t,
				dur,
				isRest: true,
				// No dynamic, isDominant, or ornament for rests
			});
			t += dur;
			continue;
		}

		if (isTripletDuration(dur)) {
			const groupSize = isTripletDuration(dur) ? 3 : 1;
			const totalDuration = dur * groupSize;
			const BEAT_LENGTH = 24;
			const isOnDownbeat = t % BEAT_LENGTH === 0;

			// Triplets can only start on a downbeat
			if (isOnDownbeat && remaining >= totalDuration && Math.random() < 0.7) {
				for (let i = 0; i < groupSize; i++) {
					m.push({
						start: t + i * dur,
						dur,
						dynamic: 'Normal',
						isDominant: true,
						ornament: null,
						isRest: false,
					});
				}
				t += totalDuration;
				continue;
			} else {
				// If we can't place a triplet, pick a non-triplet duration instead
				const nonTripletConfigs = durationConfigs.filter(
					config => !isTripletDuration(config.duration)
				);
				if (nonTripletConfigs.length > 0) {
					const newDur = pickWeightedDuration(nonTripletConfigs, remaining);
					m.push({
						start: t,
						dur: newDur,
						dynamic: 'Normal',
						isDominant: true,
						ornament: null,
						isRest: false,
					});
					t += newDur;
					continue;
				}
				// Fallback: if no non-triplet durations available, use the smallest available duration
				const fallbackDur = Math.min(remaining, ...durationConfigs.map(c => c.duration));
				m.push({
					start: t,
					dur: fallbackDur as Duration,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				});
				t += fallbackDur;
				continue;
			}
		}

		m.push({
			start: t,
			dur,
			dynamic: 'Normal',
			isDominant: true,
			ornament: null,
			isRest: false,
		});
		t += dur;
	}
	return m;
}

function shouldStartWithDominantHand(): boolean {
	return Math.random() < 0.85;
}

function shouldSwitchHands(switchProbability: number): boolean {
	return Math.random() < switchProbability;
}

function generateHandRuns(measure: Measure, difficultyConfig: DifficultyConfig): Measure {
	let currentIsDominant = shouldStartWithDominantHand();
	let noteIndex = 0;

	while (noteIndex < measure.length) {
		const runLength = sampleFromDist(difficultyConfig.runLengths, measure.length - noteIndex);

		for (let j = 0; j < runLength && noteIndex < measure.length; j++, noteIndex++) {
			if (!measure[noteIndex]!.isRest) {
				measure[noteIndex] = { ...measure[noteIndex]!, isDominant: currentIsDominant };
			}
		}

		if (shouldSwitchHands(difficultyConfig.switchProb)) {
			currentIsDominant = !currentIsDominant;
		}
	}
	return measure;
}

function selectDynamic(randomValue: number, dynamicThresholds: DynamicThresholds): DynamicName {
	const [accentThreshold, rimshotThreshold] = dynamicThresholds;
	return (
		randomValue >= rimshotThreshold ? 'Rimshot'
		: randomValue >= accentThreshold ? 'Accent'
		: 'Normal'
	);
}

function addDynamics(measure: Measure, difficultyConfig: DifficultyConfig): Measure {
	measure.forEach(note => {
		// Rests don't need dynamics
		if (!note.isRest) {
			const randomValue = Math.random(); // 0-1 scale
			note.dynamic = selectDynamic(randomValue, difficultyConfig.dynamicThresholds);
		}
	});
	return measure;
}

function selectOrnament(
	randomValue: number,
	flamThreshold: number,
	dragThreshold: number
): OrnamentName {
	if (randomValue < flamThreshold) return 'Flam';
	if (randomValue < flamThreshold + dragThreshold) return 'Drag';
	return null;
}

function addOrnaments(measure: Measure, difficultyConfig: DifficultyConfig): Measure {
	measure.forEach(note => {
		// Rests don't need ornaments
		if (!note.isRest) {
			const randomValue = Math.random();
			note.ornament = selectOrnament(
				randomValue,
				difficultyConfig.flamThreshold,
				difficultyConfig.dragThreshold
			);
		}
	});
	return measure;
}

function preventConsecutiveHandClumps(measure: Measure, maxClump: number): Measure {
	let consecutiveCount = 1;
	for (let i = 1; i < measure.length; i++) {
		// no balancing for rests
		if (measure[i]!.isRest || measure[i - 1]!.isRest) {
			consecutiveCount = 1;
			continue;
		}

		if (measure[i]!.isDominant === measure[i - 1]!.isDominant) {
			consecutiveCount++;
			if (consecutiveCount > maxClump) {
				measure[i] = { ...measure[i]!, isDominant: !measure[i]!.isDominant };
				consecutiveCount = 1;
			}
		} else {
			consecutiveCount = 1;
		}
	}
	return measure;
}

function balanceHandRatio(measure: Measure, minRatio: number, maxRatio: number): Measure {
	const playableNotes = measure.filter(n => !n.isRest);
	const total = playableNotes.length;
	let dominantCount = playableNotes.filter(n => n.isDominant).length;
	let ratio = dominantCount / total;

	if (ratio > maxRatio || ratio < minRatio) {
		const needMoreDominant = ratio < minRatio;
		for (let i = measure.length - 1; i >= 0; i--) {
			// no balancing for rests
			if (measure[i]!.isRest) continue;

			if (needMoreDominant && !measure[i]!.isDominant) {
				measure[i] = { ...measure[i]!, isDominant: true };
				dominantCount++;
				ratio = dominantCount / total;
				if (ratio >= minRatio) break;
			} else if (!needMoreDominant && measure[i]!.isDominant) {
				measure[i] = { ...measure[i]!, isDominant: false };
				dominantCount--;
				ratio = dominantCount / total;
				if (ratio <= maxRatio) break;
			}
		}
	}
	return measure;
}

function applyBalancing(measure: Measure, difficultyConfig: DifficultyConfig): Measure {
	if (!difficultyConfig.allowBalancing) return measure;

	if (difficultyConfig.maxClump) {
		preventConsecutiveHandClumps(measure, difficultyConfig.maxClump);
	}

	if (difficultyConfig.minRatio != null && difficultyConfig.maxRatio != null) {
		balanceHandRatio(measure, difficultyConfig.minRatio, difficultyConfig.maxRatio);
	}

	return measure;
}

// Split notes that cross beat boundaries into multiple notes
function splitNotesAcrossBeatBoundaries(measure: Measure): Measure {
	const BEAT_LENGTH = 24; // 24 ticks per beat
	const EXEMPT_DURATIONS = [96, 72, 48]; // Whole, dotted half, and half notes (not rests)
	const result: Measure = [];

	for (const note of measure) {
		// Exempt whole notes, dotted half notes, and half notes from splitting (but not rests)
		if (!note.isRest && EXEMPT_DURATIONS.includes(note.dur)) {
			result.push(note);
			continue;
		}

		const noteEnd = note.start + note.dur;
		const startBeat = Math.floor(note.start / BEAT_LENGTH);
		const endBeat = Math.floor((noteEnd - 1) / BEAT_LENGTH);

		// If note doesn't cross a beat boundary, keep it as is
		if (startBeat === endBeat) {
			result.push(note);
			continue;
		}

		// Note crosses one or more beat boundaries, split it
		let currentPos = note.start;
		let remainingDuration = note.dur;

		while (remainingDuration > 0) {
			const currentBeat = Math.floor(currentPos / BEAT_LENGTH);
			const nextBeatBoundary = (currentBeat + 1) * BEAT_LENGTH;
			const durationUntilBoundary = nextBeatBoundary - currentPos;

			// Determine the duration for this segment
			const segmentDuration = Math.min(remainingDuration, durationUntilBoundary);

			// Create a new note segment with the same properties
			const newNote: Note = {
				start: currentPos,
				dur: segmentDuration as Duration,
				isRest: note.isRest,
				...(note.isRest ?
					{}
				:	{
						dynamic: note.dynamic,
						isDominant: note.isDominant,
						ornament: note.ornament,
					}),
			};

			result.push(newNote);

			currentPos += segmentDuration;
			remainingDuration -= segmentDuration;
		}
	}

	return result;
}

// Enhanced version with beat grouping logic
export function fixRender(measure: Measure): Measure {
	const availableDurations = [6, 8, 12, 16, 18, 24, 36, 48, 72, 96];

	// First, split notes that cross beat boundaries
	const splitMeasure = splitNotesAcrossBeatBoundaries(measure);

	// Second, convert eighth note + eighth rest on downbeat to quarter note
	const noteRestOptimized = optimizeNoteRestPairs(splitMeasure);

	// Third, optimize sixteenth-note patterns on downbeats
	const sixteenthOptimized = optimizeSixteenthPatterns(noteRestOptimized);

	// Fourth, apply rest optimization
	const restOptimizedMeasure = optimizeRests(sixteenthOptimized, availableDurations);

	// Finally, apply beat grouping logic
	const groupedMeasure = applyBeatGrouping(restOptimizedMeasure);

	return groupedMeasure;
}

// Convert eighth note + eighth rest on downbeat to quarter note
function optimizeNoteRestPairs(measure: Measure): Measure {
	const BEAT_LENGTH = 24;
	const result: Measure = [];
	let i = 0;

	while (i < measure.length) {
		const currentNote = measure[i]!;
		const isOnDownbeat = currentNote.start % BEAT_LENGTH === 0;

		// Check if we have eighth note + eighth rest on downbeat
		if (
			i + 1 < measure.length &&
			!currentNote.isRest &&
			currentNote.dur === 12 && // Current is eighth note
			measure[i + 1]!.isRest &&
			measure[i + 1]!.dur === 12 && // Next is eighth rest
			measure[i + 1]!.start === currentNote.start + 12 && // They are consecutive
			isOnDownbeat // Must start on a downbeat
		) {
			// Convert to quarter note
			result.push({
				...currentNote,
				dur: 24, // Quarter note
			});
			i += 2; // Skip both the note and rest
		} else {
			// Keep as-is
			result.push(currentNote);
			i += 1;
		}
	}

	return result;
}

// Optimize sixteenth-note patterns starting on downbeats
function optimizeSixteenthPatterns(measure: Measure): Measure {
	const BEAT_LENGTH = 24;
	const result: Measure = [];
	let i = 0;

	while (i < measure.length) {
		const currentNote = measure[i]!;
		const isOnDownbeat = currentNote.start % BEAT_LENGTH === 0;

		// Pattern: eighth (12) + rest (6) + sixteenth (6) => dotted eighth (18) + sixteenth (6)
		// This enables the 'o' beaming pattern (dotted eighth + sixteenth)
		if (
			i + 2 < measure.length &&
			isOnDownbeat &&
			currentNote.dur === 12 && // Eighth note
			!currentNote.isRest &&
			measure[i + 1]!.dur === 6 && // Sixteenth rest
			measure[i + 1]!.isRest &&
			measure[i + 2]!.dur === 6 && // Sixteenth note
			!measure[i + 2]!.isRest &&
			measure[i + 1]!.start === currentNote.start + 12 &&
			measure[i + 2]!.start === currentNote.start + 18
		) {
			// Convert to dotted eighth + sixteenth for beaming
			result.push({
				...currentNote,
				dur: 18, // Dotted eighth
			});
			result.push(measure[i + 2]!); // Keep the sixteenth note
			i += 3;
			continue;
		}

		// Pattern: sixteenth (6) + rest (6) + eighth (12) => sixteenth (6) + dotted eighth (18)
		// This enables the 'O' beaming pattern (sixteenth + dotted eighth)
		if (
			i + 2 < measure.length &&
			isOnDownbeat &&
			currentNote.dur === 6 && // Sixteenth note
			!currentNote.isRest &&
			measure[i + 1]!.dur === 6 && // Sixteenth rest
			measure[i + 1]!.isRest &&
			measure[i + 2]!.dur === 12 && // Eighth note
			!measure[i + 2]!.isRest &&
			measure[i + 1]!.start === currentNote.start + 6 &&
			measure[i + 2]!.start === currentNote.start + 12
		) {
			// Keep sixteenth and convert eighth to dotted eighth for beaming
			result.push(currentNote); // Keep the sixteenth note
			result.push({
				...measure[i + 2]!,
				dur: 18, // Dotted eighth
			});
			i += 3;
			continue;
		}

		// Pattern: sixteenth (6) + eighth (12) + sixteenth (6) => š syncopation
		// This is the 1e&a pattern rendered as a single symbol
		if (
			i + 2 < measure.length &&
			isOnDownbeat &&
			currentNote.dur === 6 && // Sixteenth note
			!currentNote.isRest &&
			measure[i + 1]!.dur === 12 && // Eighth note
			!measure[i + 1]!.isRest &&
			measure[i + 2]!.dur === 6 && // Sixteenth note
			!measure[i + 2]!.isRest &&
			measure[i + 1]!.start === currentNote.start + 6 &&
			measure[i + 2]!.start === currentNote.start + 18
		) {
			// Combine into quarter note with š symbol, storing original notes
			result.push({
				...currentNote,
				dur: 24, // Quarter note
				symbolOverride: 'š',
				originalNotes: [currentNote, measure[i + 1]!, measure[i + 2]!],
			});
			i += 3;
			continue;
		}

		// Check if we have a 4-sixteenth pattern starting on downbeat
		if (
			i + 3 < measure.length &&
			isOnDownbeat &&
			currentNote.dur === 6 && // First is sixteenth
			measure[i + 1]!.dur === 6 && // Second is sixteenth
			measure[i + 2]!.dur === 6 && // Third is sixteenth
			measure[i + 3]!.dur === 6 && // Fourth is sixteenth
			measure[i + 1]!.start === currentNote.start + 6 &&
			measure[i + 2]!.start === currentNote.start + 12 &&
			measure[i + 3]!.start === currentNote.start + 18
		) {
			const n1 = currentNote;
			const n2 = measure[i + 1]!;
			const n3 = measure[i + 2]!;
			const n4 = measure[i + 3]!;

			// Pattern: 1e&- (note, note, note, rest) => M with duration 18
			if (!n1.isRest && !n2.isRest && !n3.isRest && n4.isRest) {
				result.push({
					...n1,
					dur: 18, // Dotted eighth
					symbolOverride: 'M',
				});
				i += 4;
				continue;
			}

			// Pattern: 1e-- (note, note, rest, rest) => O with duration 12
			if (!n1.isRest && !n2.isRest && n3.isRest && n4.isRest) {
				result.push({
					...n1,
					dur: 12, // Eighth note
					symbolOverride: 'O',
				});
				i += 4;
				continue;
			}

			// Pattern: 1e-a (note, note, rest, note) => š with duration 24
			if (!n1.isRest && !n2.isRest && n3.isRest && !n4.isRest) {
				// Combine properties from first and last note
				result.push({
					...n1,
					dur: 24, // Quarter note
					symbolOverride: 'š',
					originalNotes: [n1, n2, n4],
				});
				i += 4;
				continue;
			}

			// Pattern: 1-&a (note, rest, note, note) => m with duration 24
			if (!n1.isRest && n2.isRest && !n3.isRest && !n4.isRest) {
				result.push({
					...n1,
					dur: 24, // Quarter note
					symbolOverride: 'm',
					originalNotes: [n1, n3, n4],
				});
				i += 4;
				continue;
			}

			// Pattern: 1--a (note, rest, rest, note) => o with duration 24
			if (!n1.isRest && n2.isRest && n3.isRest && !n4.isRest) {
				result.push({
					...n1,
					dur: 24, // Quarter note
					symbolOverride: 'o',
					originalNotes: [n1, n1, n4], // First note appears twice for visual alignment
				});
				i += 4;
				continue;
			}
		}

		// No pattern matched, keep as-is
		result.push(currentNote);
		i += 1;
	}

	return result;
}

// Rest optimization function (extracted from original fixRender)
function optimizeRests(measure: Measure, availableDurations: number[]): Measure {
	const result: Measure = [];
	let i = 0;

	while (i < measure.length) {
		const currentNote = measure[i]!;

		// If it's a rest, try to combine with consecutive rests
		if (currentNote.isRest) {
			let combinedDuration = currentNote.dur;
			let j = i + 1;

			// Look for consecutive rests
			while (
				j < measure.length &&
				measure[j]!.isRest &&
				measure[j]!.start === measure[j - 1]!.start + measure[j - 1]!.dur
			) {
				combinedDuration += measure[j]!.dur;
				j++;
			}

			// Check if combined duration is a valid note duration
			if (availableDurations.includes(combinedDuration)) {
				// Special case: 4 quarter rests = whole rest
				if (j - i === 4 && measure.slice(i, j).every(note => note.dur === 24)) {
					result.push({
						start: currentNote.start,
						dur: 96,
						isRest: true,
					});
				} else {
					// Combine the rests
					result.push({
						start: currentNote.start,
						dur: combinedDuration,
						isRest: true,
					});
				}
			} else {
				// Try partial combinations - look for smaller valid combinations
				const optimizedRests = optimizeRestSequence(measure.slice(i, j), availableDurations);
				result.push(...optimizedRests);
			}

			i = j;
		} else {
			// It's a note, just add it as-is
			result.push(currentNote);
			i++;
		}
	}

	return result;
}

// Beat grouping function to ensure proper note grouping within beats
function applyBeatGrouping(measure: Measure): Measure {
	const result: Measure = [];
	const BEAT_LENGTH = 24; // 24 ticks per beat

	// Find the total length of the measure to determine number of beats
	const measureLength = measure.length > 0 ? Math.max(...measure.map(n => n.start + n.dur)) : 0;
	const numBeats = Math.ceil(measureLength / BEAT_LENGTH);

	for (let beatIndex = 0; beatIndex < numBeats; beatIndex++) {
		const beatStart = beatIndex * BEAT_LENGTH;
		const beatEnd = beatStart + BEAT_LENGTH;

		// Get all notes that start within this beat
		const beatNotes = measure
			.filter(note => note.start >= beatStart && note.start < beatEnd)
			.sort((a, b) => a.start - b.start);

		if (beatNotes.length === 0) continue;

		// Process notes in this beat
		const processedNotes = processBeatNotes(beatNotes, beatStart, beatEnd);
		result.push(...processedNotes);
	}

	return result;
}

// Process notes within a single beat, applying grouping rules
function processBeatNotes(notes: Note[], beatStart: number, beatEnd: number): Note[] {
	if (notes.length === 0) return [];

	const result: Note[] = [];
	let i = 0;

	while (i < notes.length) {
		const currentNote = notes[i]!;

		// Exempt whole notes (96) and half notes (48) from grouping
		if (currentNote.dur >= 48) {
			result.push(currentNote);
			i++;
			continue;
		}

		// Check for the specific case: dotted quarter (36) on downbeat followed by quarter (24)
		if (i + 1 < notes.length) {
			const nextNote = notes[i + 1]!;

			// Check if current note is dotted quarter on downbeat and next is quarter
			if (
				currentNote.dur === 36 &&
				currentNote.start === beatStart &&
				nextNote.dur === 24 &&
				!currentNote.isRest &&
				!nextNote.isRest
			) {
				// Replace with eighth note + eighth rest + quarter note
				result.push({
					...currentNote,
					dur: 12, // eighth note
				});

				// Add eighth rest
				result.push({
					start: currentNote.start + 12,
					dur: 12,
					isRest: true,
				});

				// Add the quarter note at the next beat
				result.push({
					...nextNote,
					start: currentNote.start + 24,
				});

				i += 2; // Skip both processed notes
				continue;
			}
		}

		// Check if dotted quarter starts on upbeat (not on beat boundary)
		if (currentNote.dur === 36 && currentNote.start !== beatStart) {
			// Dotted quarter on upbeat is good as-is
			result.push(currentNote);
			i++;
			continue;
		}

		// Check if dotted quarter on downbeat followed by eighth note
		if (
			currentNote.dur === 36 &&
			currentNote.start === beatStart &&
			i + 1 < notes.length &&
			notes[i + 1]!.dur === 12 &&
			!currentNote.isRest &&
			!notes[i + 1]!.isRest
		) {
			// This is good as-is
			result.push(currentNote);
			i++;
			continue;
		}

		// Default case: add note as-is
		result.push(currentNote);
		i++;
	}

	return result;
}

// Helper function to optimize sequences of rests that can't be fully combined
function optimizeRestSequence(rests: Note[], availableDurations: number[]): Note[] {
	if (rests.length <= 1) return rests;

	const result: Note[] = [];
	let i = 0;

	while (i < rests.length) {
		let bestCombination = rests[i]!;
		let bestScore = 1; // Start with single rest
		let j = i + 1;

		// Try combinations starting from current position
		while (j < rests.length && rests[j]!.start === rests[j - 1]!.start + rests[j - 1]!.dur) {
			const combinedDuration = rests.slice(i, j + 1).reduce((sum, rest) => sum + rest.dur, 0);

			// If this combination is valid, it's better than individual rests
			if (availableDurations.includes(combinedDuration)) {
				bestCombination = {
					start: rests[i]!.start,
					dur: combinedDuration as Duration,
					isRest: true,
				};
				bestScore = j - i + 1; // Number of rests combined
			}

			j++;
		}

		// Add the best combination found
		result.push(bestCombination);

		// Move to next unprocessed rest
		i += bestScore;
	}

	return result;
}

// function findBestGroup(
// 	measure: Measure,
// 	startIndex: number,
// 	processed: Set<number>,
// 	availableDurations: number[]
// ): Note[] {
// 	const currentNote = measure[startIndex]!;

// 	// Try different group sizes to find the best combination
// 	let bestGroup: Note[] = [currentNote];
// 	let bestScore = 0;

// 	// Try groups of size 2, 3, 4, etc.
// 	for (let groupSize = 2; groupSize <= Math.min(4, measure.length - startIndex); groupSize++) {
// 		const group: Note[] = [];
// 		let canFormGroup = true;

// 		// Check if we can form a group of this size
// 		for (let i = 0; i < groupSize; i++) {
// 			const index = startIndex + i;
// 			if (index >= measure.length || processed.has(index)) {
// 				canFormGroup = false;
// 				break;
// 			}
// 			group.push(measure[index]!);
// 		}

// 		if (!canFormGroup) break;

// 		// Check if the notes are temporally consecutive (no gaps in time)
// 		let isTemporallyConsecutive = true;
// 		for (let i = 1; i < group.length; i++) {
// 			const prevNote = group[i - 1]!;
// 			const currentNote = group[i]!;
// 			const expectedStart = prevNote.start + prevNote.dur;
// 			if (currentNote.start !== expectedStart) {
// 				isTemporallyConsecutive = false;
// 				break;
// 			}
// 		}

// 		if (!isTemporallyConsecutive) continue;

// 		// Allow mixed groupings - we'll handle them in the scoring logic

// 		// Calculate the combined duration
// 		const combinedDuration = group.reduce((sum, note) => sum + note.dur, 0);

// 		// Check if this combination is valid
// 		let score = 0;

// 		// Check if all notes in the group are the same type
// 		const isRestGroup = group[0]!.isRest;
// 		const allSameType = group.every(note => note.isRest === isRestGroup);

// 		if (allSameType) {
// 			// Same type grouping - only score rest combinations
// 			if (isRestGroup) {
// 				// Special case: 4 consecutive quarter rests = whole rest
// 				if (group.length === 4 && group.every(note => note.dur === 24)) {
// 					score = 100; // High score for this special case
// 				} else if (availableDurations.includes(combinedDuration)) {
// 					score = group.length; // Score based on how many rests we're combining
// 				}
// 			}
// 			// Notes should not be combined, so no scoring for note groups
// 		} else {
// 			// Mixed grouping - only score if ALL notes in the group are rests
// 			const allRests = group.every(note => note.isRest);
// 			if (allRests && availableDurations.includes(combinedDuration)) {
// 				score = group.length; // Score based on how many rests we're combining
// 			}
// 		}

// 		if (score > bestScore) {
// 			bestScore = score;
// 			bestGroup = group;
// 		}
// 	}

// 	return bestGroup;
// }

// function getOptimalRestDuration(
// 	totalDuration: number,
// 	availableDurations: number[]
// ): Duration | null {
// 	for (const duration of availableDurations) {
// 		if (duration === totalDuration) {
// 			return duration as Duration;
// 		}
// 	}
// 	return null;
// }

export function generateBeat(formData: BeatFormData): GeneratedBeat {
	const difficultyConfig = getDifficultyConfig(formData.difficulty);
	const gridSize = formData.beats * 24;

	const measures = Array.from({ length: formData.measures }, () => {
		const measure = generateRhythm(
			difficultyConfig.durations,
			gridSize,
			difficultyConfig.restProbability
		);

		// Log optimization details
		const originalRests = measure.filter(n => n.isRest);
		const optimizedMeasure = fixRender(measure);
		const optimizedRests = optimizedMeasure.filter(n => n.isRest);

		if (originalRests.length > 0 || optimizedRests.length > 0) {
			console.log(`\n--- REST OPTIMIZATION ---`);
			const originalRestStr = originalRests.map(r => `R${r.dur}@${r.start}`).join(' | ') || 'none';
			const optimizedRestStr =
				optimizedRests.map(r => `R${r.dur}@${r.start}`).join(' | ') || 'none';

			console.log(`Before: ${originalRestStr}`);
			console.log(`After:  ${optimizedRestStr}`);

			if (originalRests.length !== optimizedRests.length) {
				console.log(
					`✅ Reduced from ${originalRests.length} to ${optimizedRests.length} rest segments`
				);
			} else {
				console.log(`No optimization needed`);
			}
		}

		return applyBalancing(
			addOrnaments(
				addDynamics(generateHandRuns(optimizedMeasure, difficultyConfig), difficultyConfig),
				difficultyConfig
			),
			difficultyConfig
		);
	});

	return {
		measures,
		beatsPerMeasure: formData.beats,
		difficulty: formData.difficulty,
	};
}
