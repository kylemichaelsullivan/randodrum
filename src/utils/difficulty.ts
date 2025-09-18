/**
 * Difficulty-related utility functions and constants
 */

import { DURATION_CONFIGS } from './constants';
import type { DifficultyConfig, DifficultyLevel, Duration, DynamicScale } from '@/types';

// Common duration arrays derived from DURATION_CONFIGS
const BEGINNER_DURATIONS: Duration[] = [
	DURATION_CONFIGS.find(d => d.name === 'Whole')!.value, // 96
	DURATION_CONFIGS.find(d => d.name === 'Dotted Half')!.value, // 72
	DURATION_CONFIGS.find(d => d.name === 'Half')!.value, // 48
	DURATION_CONFIGS.find(d => d.name === 'Quarter')!.value, // 24
];

const EASY_DURATIONS: Duration[] = [
	DURATION_CONFIGS.find(d => d.name === 'Half')!.value, // 48
	DURATION_CONFIGS.find(d => d.name === 'Dotted Quarter')!.value, // 36
	DURATION_CONFIGS.find(d => d.name === 'Quarter')!.value, // 24
	DURATION_CONFIGS.find(d => d.name === 'Eighth')!.value, // 12
];

const MODERATE_DURATIONS: Duration[] = [
	DURATION_CONFIGS.find(d => d.name === 'Dotted Quarter')!.value, // 36
	DURATION_CONFIGS.find(d => d.name === 'Quarter')!.value, // 24
	DURATION_CONFIGS.find(d => d.name === 'Dotted Eighth')!.value, // 18
	DURATION_CONFIGS.find(d => d.name === 'Eighth')!.value, // 12
	DURATION_CONFIGS.find(d => d.name === 'Eighth Triplet')!.value, // 8
	DURATION_CONFIGS.find(d => d.name === 'Sixteenth')!.value, // 6
];

const HARD_DURATIONS: Duration[] = [
	DURATION_CONFIGS.find(d => d.name === 'Dotted Quarter')!.value, // 36
	DURATION_CONFIGS.find(d => d.name === 'Quarter')!.value, // 24
	DURATION_CONFIGS.find(d => d.name === 'Dotted Eighth')!.value, // 18
	DURATION_CONFIGS.find(d => d.name === 'Eighth')!.value, // 12
	DURATION_CONFIGS.find(d => d.name === 'Eighth Triplet')!.value, // 8
	DURATION_CONFIGS.find(d => d.name === 'Sixteenth')!.value, // 6
	DURATION_CONFIGS.find(d => d.name === 'Thirty-Second')!.value, // 3
];

// Constants
export const DIFFICULTY_LEVELS: readonly DifficultyLevel[] = [
	'I’m Too Young to Drum',
	'Hey, Not Too Rough',
	'Hurt Me Plenty',
	'Ultra-Violence',
	'Drumline!',
] as const;

// Centralized difficulty configurations
export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
	'I’m Too Young to Drum': {
		durations: BEGINNER_DURATIONS,
		restProbability: 0.3,
		runLengths: { 1: 1.0 },
		switchProb: 1.0,
		dynamicScale: [0, 10, 10, 10] as DynamicScale,
		flamThreshold: 0,
		dragThreshold: 0,
		allowBalancing: true,
		maxClump: 1,
		minRatio: 0.45,
		maxRatio: 0.55,
	},
	'Hey, Not Too Rough': {
		durations: EASY_DURATIONS,
		restProbability: 0.25,
		runLengths: { 1: 0.7, 2: 0.3 },
		switchProb: 0.8,
		dynamicScale: [0, 8, 10, 10] as DynamicScale,
		flamThreshold: 0.05,
		dragThreshold: 0,
		allowBalancing: true,
		maxClump: 2,
		minRatio: 0.45,
		maxRatio: 0.55,
	},
	'Hurt Me Plenty': {
		durations: MODERATE_DURATIONS,
		restProbability: 0.2,
		runLengths: { 1: 0.5, 2: 0.3, 3: 0.2 },
		switchProb: 0.6,
		dynamicScale: [0.5, 6, 9, 9.5] as DynamicScale,
		flamThreshold: 0.1,
		dragThreshold: 0.1,
		allowBalancing: true,
		maxClump: 3,
		minRatio: 0.4,
		maxRatio: 0.6,
	},
	'Ultra-Violence': {
		durations: HARD_DURATIONS,
		restProbability: 0.15,
		runLengths: { 1: 0.4, 2: 0.3, 3: 0.2, 4: 0.1 },
		switchProb: 0.4,
		dynamicScale: [2, 7, 9, 10] as DynamicScale,
		flamThreshold: 0.15,
		dragThreshold: 0.15,
		allowBalancing: true,
		maxClump: 4,
		minRatio: 0.35,
		maxRatio: 0.65,
	},
	'Drumline!': {
		durations: HARD_DURATIONS,
		restProbability: 0.1,
		runLengths: { 1: 0.25, 2: 0.25, 3: 0.25, 4: 0.25 },
		switchProb: 0.5,
		dynamicScale: [2, 7, 9, 10] as DynamicScale,
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
	// Add display formatting logic here if needed
	return difficulty;
};
