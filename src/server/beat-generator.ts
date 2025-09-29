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

			if (remaining >= totalDuration && Math.random() < 0.7) {
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
		// Rests don't need hand balancing
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
			// Rests don't need hand balancing
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

export function fixRender(measure: Measure): Measure {
	const allPossibleDurations = [6, 8, 12, 16, 18, 24, 36, 48, 72, 96];
	const availableDurations = new Set(allPossibleDurations);
	const sortedDurations = Array.from(availableDurations).sort((a, b) => b - a);

	const result: Measure = [];
	const processed = new Set<number>();

	for (let i = 0; i < measure.length; i++) {
		if (processed.has(i)) continue;

		const currentNote = measure[i]!;

		// Try to find the best grouping starting from this position
		const bestGroup = findBestGroup(measure, i, processed, sortedDurations);

		if (bestGroup.length > 1) {
			// We found a group that can be combined
			const combinedDuration = bestGroup.reduce((sum, note) => sum + note.dur, 0);
			const isRestGroup = bestGroup[0]!.isRest;
			const allSameType = bestGroup.every(note => note.isRest === isRestGroup);

			if (allSameType) {
				// All same type grouping
				if (isRestGroup) {
					// Special case: 4 consecutive quarter rests = whole rest
					if (bestGroup.length === 4 && bestGroup.every(note => note.dur === 24)) {
						result.push({
							start: currentNote.start,
							dur: 96, // Whole rest
							isRest: true,
						});
					} else {
						const optimalRest = getOptimalRestDuration(combinedDuration, sortedDurations);
						if (optimalRest && optimalRest === combinedDuration) {
							result.push({
								start: currentNote.start,
								dur: optimalRest,
								isRest: true,
							});
						} else {
							for (const note of bestGroup) {
								result.push(note);
							}
						}
					}
				} else {
					// Notes should not be combined - preserve them as individual notes
					for (const note of bestGroup) {
						result.push(note);
					}
				}
			} else {
				// Mixed grouping - only combine if it's all rests
				if (isRestGroup) {
					const optimalRest = getOptimalRestDuration(combinedDuration, sortedDurations);
					if (optimalRest && optimalRest === combinedDuration) {
						result.push({
							start: currentNote.start,
							dur: optimalRest,
							isRest: true,
						});
					} else {
						for (const note of bestGroup) {
							result.push(note);
						}
					}
				} else {
					// Mixed grouping with notes - preserve all notes individually
					for (const note of bestGroup) {
						result.push(note);
					}
				}
			}

			bestGroup.forEach((_, index) => processed.add(i + index));
		} else {
			// No grouping possible, just add the single note
			result.push(currentNote);
			processed.add(i);
		}
	}

	return result;
}

function findBestGroup(
	measure: Measure,
	startIndex: number,
	processed: Set<number>,
	availableDurations: number[]
): Note[] {
	const currentNote = measure[startIndex]!;

	// Try different group sizes to find the best combination
	let bestGroup: Note[] = [currentNote];
	let bestScore = 0;

	// Try groups of size 2, 3, 4, etc.
	for (let groupSize = 2; groupSize <= Math.min(4, measure.length - startIndex); groupSize++) {
		const group: Note[] = [];
		let canFormGroup = true;

		// Check if we can form a group of this size
		for (let i = 0; i < groupSize; i++) {
			const index = startIndex + i;
			if (index >= measure.length || processed.has(index)) {
				canFormGroup = false;
				break;
			}
			group.push(measure[index]!);
		}

		if (!canFormGroup) break;

		// Check if the notes are temporally consecutive (no gaps in time)
		let isTemporallyConsecutive = true;
		for (let i = 1; i < group.length; i++) {
			const prevNote = group[i - 1]!;
			const currentNote = group[i]!;
			const expectedStart = prevNote.start + prevNote.dur;
			if (currentNote.start !== expectedStart) {
				isTemporallyConsecutive = false;
				break;
			}
		}

		if (!isTemporallyConsecutive) continue;

		// Allow mixed groupings - we'll handle them in the scoring logic

		// Calculate the combined duration
		const combinedDuration = group.reduce((sum, note) => sum + note.dur, 0);

		// Check if this combination is valid
		let score = 0;

		// Check if all notes in the group are the same type
		const isRestGroup = group[0]!.isRest;
		const allSameType = group.every(note => note.isRest === isRestGroup);

		if (allSameType) {
			// Same type grouping - only score rest combinations
			if (isRestGroup) {
				// Special case: 4 consecutive quarter rests = whole rest
				if (group.length === 4 && group.every(note => note.dur === 24)) {
					score = 100; // High score for this special case
				} else if (availableDurations.includes(combinedDuration)) {
					score = group.length; // Score based on how many rests we're combining
				}
			}
			// Notes should not be combined, so no scoring for note groups
		} else {
			// Mixed grouping - only score if ALL notes in the group are rests
			const allRests = group.every(note => note.isRest);
			if (allRests && availableDurations.includes(combinedDuration)) {
				score = group.length; // Score based on how many rests we're combining
			}
		}

		if (score > bestScore) {
			bestScore = score;
			bestGroup = group;
		}
	}

	return bestGroup;
}

function getOptimalRestDuration(
	totalDuration: number,
	availableDurations: number[]
): Duration | null {
	for (const duration of availableDurations) {
		if (duration === totalDuration) {
			return duration as Duration;
		}
	}
	return null;
}

export function generateBeat(formData: BeatFormData): GeneratedBeat {
	const difficultyConfig = getDifficultyConfig(formData.difficulty);
	const gridSize = formData.beats * 24;

	const measures = Array.from({ length: formData.measures }, () => {
		const measure = generateRhythm(
			difficultyConfig.durations,
			gridSize,
			difficultyConfig.restProbability
		);

		return fixRender(
			applyBalancing(
				addOrnaments(
					addDynamics(generateHandRuns(measure, difficultyConfig), difficultyConfig),
					difficultyConfig
				),
				difficultyConfig
			)
		);
	});

	return {
		measures,
		beatsPerMeasure: formData.beats,
		difficulty: formData.difficulty,
	};
}
