/**
 * Difficulty-related utility functions and constants
 */

import type { DifficultyConfig, DifficultyLevel, DynamicScale } from '@/types';

export const DIFFICULTY_LEVELS: readonly DifficultyLevel[] = [
	'I’m Too Young to Drum',
	'Hey, Not Too Rough',
	'Hurt Me Plenty',
	'Ultra-Violence',
	'Drumline!',
] as const;

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
	'I’m Too Young to Drum': {
		durations: [
			{ duration: 24, weight: 0.6 }, // Quarter
			{ duration: 48, weight: 0.25 }, // Half
			{ duration: 72 }, // Dotted Half
			{ duration: 96 }, // Whole
		],
		restProbability: 0.3,
		runLengths: { 1: 1.0 },
		switchProb: 1.0,
		dynamicScale: [0, 10, 10] as DynamicScale,
		flamThreshold: 0,
		dragThreshold: 0,
		allowBalancing: true,
		maxClump: 1,
		minRatio: 0.45,
		maxRatio: 0.55,
	},
	'Hey, Not Too Rough': {
		durations: [
			{ duration: 12, weight: 0.3 }, // Eighth
			{ duration: 24, weight: 0.5 }, // Quarter
			{ duration: 36 }, // Dotted Quarter
			{ duration: 48 }, // Half
		],
		restProbability: 0.25,
		runLengths: { 1: 0.7, 2: 0.3 },
		switchProb: 0.8,
		dynamicScale: [0, 8, 10] as DynamicScale,
		flamThreshold: 0.05,
		dragThreshold: 0,
		allowBalancing: true,
		maxClump: 2,
		minRatio: 0.45,
		maxRatio: 0.55,
	},
	'Hurt Me Plenty': {
		durations: [
			{ duration: 6, weight: 0.2 }, // Sixteenth
			{ duration: 8, weight: 0.05 }, // Eighth Triplet
			{ duration: 12, weight: 0.25 }, // Eighth
			{ duration: 18, weight: 0.1 }, // Dotted Eighth
			{ duration: 24, weight: 0.3 }, // Quarter
			{ duration: 36, weight: 0.1 }, // Dotted Quarter
		],
		restProbability: 0.2,
		runLengths: { 1: 0.5, 2: 0.3, 3: 0.2 },
		switchProb: 0.6,
		dynamicScale: [0.5, 6, 9] as DynamicScale,
		flamThreshold: 0.1,
		dragThreshold: 0.1,
		allowBalancing: true,
		maxClump: 3,
		minRatio: 0.4,
		maxRatio: 0.6,
	},
	'Ultra-Violence': {
		durations: [
			{ duration: 6, weight: 0.2 }, // Sixteenth
			{ duration: 8, weight: 0.15 }, // Eighth Triplet
			{ duration: 12, weight: 0.25 }, // Eighth
			{ duration: 16, weight: 0.1 }, // Quarter Triplet
			{ duration: 18, weight: 0.1 }, // Dotted Eighth
			{ duration: 24, weight: 0.15 }, // Quarter
			{ duration: 36, weight: 0.15 }, // Dotted Quarter
		],
		restProbability: 0.15,
		runLengths: { 1: 0.4, 2: 0.3, 3: 0.2, 4: 0.1 },
		switchProb: 0.4,
		dynamicScale: [2, 7, 9] as DynamicScale,
		flamThreshold: 0.15,
		dragThreshold: 0.15,
		allowBalancing: true,
		maxClump: 4,
		minRatio: 0.35,
		maxRatio: 0.65,
	},
	'Drumline!': {
		durations: [
			{ duration: 6, weight: 0.3 }, // Sixteenth
			{ duration: 8, weight: 0.2 }, // Eighth Triplet
			{ duration: 12, weight: 0.25 }, // Eighth
			{ duration: 16, weight: 0.05 }, // Quarter Triplet
			{ duration: 18, weight: 0.08 }, // Dotted Eighth
			{ duration: 24, weight: 0.1 }, // Quarter
			{ duration: 36, weight: 0.02 }, // Dotted Quarter
		],
		restProbability: 0.1,
		runLengths: { 1: 0.25, 2: 0.25, 3: 0.25, 4: 0.25 },
		switchProb: 0.5,
		dynamicScale: [2, 7, 9] as DynamicScale,
		flamThreshold: 0.25,
		dragThreshold: 0.25,
		allowBalancing: false,
	},
} as const;

// Utility functions
export const getDifficultyConfig = (difficulty: DifficultyLevel): DifficultyConfig => {
	const config = DIFFICULTY_CONFIGS[difficulty];
	if (!config) {
		throw new Error(`Unknown difficulty level: ${difficulty}`);
	}
	return config;
};

export const getDifficultyOptions = (): readonly DifficultyLevel[] => {
	return DIFFICULTY_LEVELS;
};

export const isValidDifficultyLevel = (value: string): value is DifficultyLevel => {
	return DIFFICULTY_LEVELS.includes(value as DifficultyLevel);
};

export const getDifficultyDisplayName = (difficulty: DifficultyLevel): string => {
	return difficulty;
};
