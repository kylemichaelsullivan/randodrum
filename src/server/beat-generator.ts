import { getDifficultyConfig } from '@/utils';
import { isTupletDuration, isTripletDuration } from '@/types/duration';

import type {
	BeatFormData,
	DifficultyConfig,
	Duration,
	DurationWeightConfig,
	GeneratedBeat,
	Measure,
} from '@/types';
import type { DynamicName } from '@/types/dynamic';
import type { OrnamentName } from '@/types/ornament';

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
	measureLen: number
): Measure {
	const m: Measure = [];
	let t = 0;

	while (t < measureLen) {
		const remaining = measureLen - t;
		const dur = pickWeightedDuration(durationConfigs, remaining);

		if (isTupletDuration(dur)) {
			const groupSize = isTripletDuration(dur) ? 3 : 1;
			const totalDuration = dur * groupSize;

			if (remaining >= totalDuration && Math.random() < 0.7) {
				for (let i = 0; i < groupSize; i++) {
					m.push({
						start: t + i * dur,
						dur,
						isDominant: true,
						dynamic: 'normal',
						ornament: null,
					});
				}
				t += totalDuration;
				continue;
			}
		}

		m.push({
			start: t,
			dur,
			isDominant: true,
			dynamic: 'normal',
			ornament: null,
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
			measure[noteIndex] = { ...measure[noteIndex]!, isDominant: currentIsDominant };
		}

		if (shouldSwitchHands(difficultyConfig.switchProb)) {
			currentIsDominant = !currentIsDominant;
		}
	}
	return measure;
}

function selectDynamic(randomValue: number, dynamicScale: [number, number]): DynamicName {
	const [normalThreshold, accentThreshold] = dynamicScale;

	if (randomValue < normalThreshold) return 'normal';
	if (randomValue < accentThreshold) return 'accent';
	return 'rimshot';
}

function addDynamics(measure: Measure, difficultyConfig: DifficultyConfig): Measure {
	measure.forEach(note => {
		const randomValue = Math.random(); // 0-1 scale
		note.dynamic = selectDynamic(randomValue, difficultyConfig.dynamicScale);
	});
	return measure;
}

function selectOrnament(
	randomValue: number,
	flamThreshold: number,
	dragThreshold: number
): OrnamentName {
	if (randomValue < flamThreshold) return 'flam';
	if (randomValue < flamThreshold + dragThreshold) return 'drag';
	return null;
}

function addOrnaments(measure: Measure, difficultyConfig: DifficultyConfig): Measure {
	measure.forEach(note => {
		const randomValue = Math.random();
		note.ornament = selectOrnament(
			randomValue,
			difficultyConfig.flamThreshold,
			difficultyConfig.dragThreshold
		);
	});
	return measure;
}

function preventConsecutiveHandClumps(measure: Measure, maxClump: number): Measure {
	let consecutiveCount = 1;
	for (let i = 1; i < measure.length; i++) {
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
	const total = measure.length;
	let dominantCount = measure.filter(n => n.isDominant).length;
	let ratio = dominantCount / total;

	if (ratio > maxRatio || ratio < minRatio) {
		const needMoreDominant = ratio < minRatio;
		for (let i = measure.length - 1; i >= 0; i--) {
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
		const measure = generateRhythm(difficultyConfig.durations, gridSize);
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
