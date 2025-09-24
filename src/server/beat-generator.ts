import { getDifficultyConfig } from '@/utils';
import { isTripletDuration } from '@/types';

import type {
	BeatFormData,
	DifficultyConfig,
	Duration,
	DurationWeightConfig,
	GeneratedBeat,
	Measure,
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

		// Apply rest probability - create a rest object if random value is below threshold
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

function selectDynamicFlags(
	randomValue: number,
	dynamicScale: [number, number]
): { isAccent: boolean; isRimshot: boolean } {
	const [normalThreshold, accentThreshold] = dynamicScale;

	if (randomValue < normalThreshold) return { isAccent: false, isRimshot: false };
	if (randomValue < accentThreshold) return { isAccent: true, isRimshot: false };
	return { isAccent: false, isRimshot: true };
}

function addDynamics(measure: Measure, difficultyConfig: DifficultyConfig): Measure {
	measure.forEach(note => {
		// Rests don't need dynamic assignment
		if (!note.isRest) {
			const randomValue = Math.random(); // 0-1 scale
			const dynamicFlags = selectDynamicFlags(randomValue, difficultyConfig.dynamicScale);

			if (dynamicFlags.isAccent) {
				note.dynamic = 'Accent';
			} else if (dynamicFlags.isRimshot) {
				note.dynamic = 'Rimshot';
			} else {
				note.dynamic = 'Normal';
			}
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
		// Rests don't need ornament assignment
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

function fixRender(measure: Measure): Measure {
	// TODO: Implement ligature/symbol replacement for grouped notes
	return measure;
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
