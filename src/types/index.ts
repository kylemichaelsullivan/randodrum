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

export type BeatNote = {
	value: number;
	sticking: 'R' | 'L';
	isTuplet: boolean;
	isRest: boolean;
	technique?: 'accent' | 'flam' | 'drag' | 'ghost';
};

export type Beat = {
	notes: BeatNote[];
	totalValue: number; // Should always equal 8
};

export type Measure = {
	beats: Beat[];
};

export type GeneratedBeat = {
	measures: Measure[];
	beatsPerMeasure: number;
	difficulty: DifficultyLevel;
};
