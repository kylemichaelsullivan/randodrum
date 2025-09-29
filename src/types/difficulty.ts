/**
 * Difficulty level and configuration types
 */

import type { Duration } from './duration';
import type { DynamicThresholds } from './dynamic';

export const DIFFICULTY_LEVELS = [
	'I’m Too Young to Drum',
	'Hey, Not Too Ruff',
	'Hurt Me Plenty',
	'Ultra-Violence',
	'Drumline!',
] as const;

export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export type DurationWeightConfig = {
	duration: Duration;
	weight?: number; // 0-1 probability weight
};

export type DifficultyConfig = {
	// Rhythm generation
	durations: DurationWeightConfig[];
	restProbability: number; // 0-1, probability of adding rests

	// Sticking generation
	runLengths: Record<number, number>;
	switchProb: number;

	// Dynamics
	dynamicThresholds: DynamicThresholds;

	// Ornaments
	flamThreshold: number;
	dragThreshold: number;

	// Balancing stage
	allowBalancing: boolean;
	maxClump?: number;
	minRatio?: number;
	maxRatio?: number;
};
