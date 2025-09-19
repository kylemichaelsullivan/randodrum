import type { Duration } from './duration';
import type { DynamicScale } from './dynamic';

// Difficulty level constants
export type DifficultyLevel =
	| 'I’m Too Young to Drum'
	| 'Hey, Not Too Rough'
	| 'Hurt Me Plenty'
	| 'Ultra-Violence'
	| 'Drumline!';

// Duration configuration (optional weight)
export type DurationWeightConfig = {
	duration: Duration;
	weight?: number; // 0-1 probability weight
};

// Difficulty configuration type
export type DifficultyConfig = {
	// Rhythm generation
	durations: DurationWeightConfig[];
	restProbability: number; // 0-1, probability of adding rests

	// Sticking generation
	runLengths: Record<number, number>;
	switchProb: number;

	// Dynamics
	dynamicScale: DynamicScale;

	// Ornaments
	flamThreshold: number;
	dragThreshold: number;

	// Balancing stage
	allowBalancing: boolean;
	maxClump?: number;
	minRatio?: number;
	maxRatio?: number;
};
