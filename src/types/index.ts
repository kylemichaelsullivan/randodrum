export type DifficultyLevel =
	| "I'm Too Young to Drum"
	| 'Hey, Not Too Rough'
	| 'Hurt Me Plenty'
	| 'Ultra-Violence'
	| 'Drumline!';

export type BeatFormData = {
	beats: number;
	measures: number;
	difficulty: DifficultyLevel;
};
