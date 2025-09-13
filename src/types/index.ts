export type DifficultyLevel =
	| 'I’m Too Young to Drum'
	| 'Hey, Not Too Rough'
	| 'Hurt Me Plenty'
	| 'Ultra-Violence'
	| 'Drumline!';

export type BeatFormData = {
	beats: number;
	measures: number;
	difficulty: DifficultyLevel;
};

export type Dynamic = 'ghost' | 'normal' | 'accent' | 'rimshot';
export type Ornament = 'flam' | 'drag' | null;

export interface Note {
	start: number;
	dur: number;
	isDominant: boolean;
	dynamic: Dynamic;
	ornament: Ornament;
}

export type Measure = Note[]; // one bar (sum(dur) = gridSize)
export type Exercise = Measure[];
export type Samples = Record<string, Measure[]>;

export interface DifficultyConfig {
	// Rhythm generation
	durations: number[];

	// Sticking generation
	runLengths: Record<number, number>;
	switchProb: number;

	dynamicScale: [number, number, number, number];

	// Ornaments
	flamThreshold: number;
	dragThreshold: number;

	// Balancing stage
	allowBalancing: boolean;
	maxClump?: number;
	minRatio?: number;
	maxRatio?: number;
}

export type GeneratedBeat = {
	measures: Measure[];
	beatsPerMeasure: number;
	difficulty: DifficultyLevel;
};
