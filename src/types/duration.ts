/**
 * Note duration type definitions for 24-ticks/beat-grid system
 */

// Straight note durations (power-of-two divisions)
export type StraightDuration =
	| 3 // Thirty-Second Note
	| 6 // Sixteenth Note
	| 12 // Eighth Note
	| 24 // Quarter Note
	| 48 // Half Note
	| 96; // Whole Note

// Triplet durations (divide by 3)
export type TripletDuration =
	| 8 // Eighth Triplet
	| 16; // Quarter Triplet

// Sixtuplet durations (divide by 6)
export type SixtupletDuration =
	| 2 // Sixteenth Sixtuplet
	| 4; // Eighth Sixtuplet

// Dotted note durations (1.5x the base duration)
export type DottedDuration =
	| 9 // Dotted Sixteenth Note
	| 18 // Dotted Eighth Note
	| 36 // Dotted Quarter Note
	| 72; // Dotted Half Note

// Duration value type - precise union of all valid values for grid system
export type DurationValue = StraightDuration | DottedDuration | TripletDuration | SixtupletDuration;

// Duration type alias
export type Duration = DurationValue;

// Duration configuration type
export type DurationConfig = {
	value: DurationValue;
	name: string;
	symbol: string;
};

// Helper functions for duration type checking
export const isTripletDuration = (duration: DurationValue): duration is TripletDuration => {
	return [8, 16].includes(duration);
};

export const isSixtupletDuration = (duration: DurationValue): duration is SixtupletDuration => {
	return [2, 4].includes(duration);
};

export const isDottedDuration = (duration: DurationValue): duration is DottedDuration => {
	return [9, 18, 36, 72].includes(duration);
};

export const isStraightDuration = (duration: DurationValue): duration is StraightDuration => {
	return [3, 6, 12, 24, 48, 96].includes(duration);
};

export const isTupletDuration = (duration: DurationValue): boolean => {
	return isTripletDuration(duration) || isSixtupletDuration(duration);
};

// Arrays for convenience
export const STRAIGHT_DURATIONS: readonly StraightDuration[] = [3, 6, 12, 24, 48, 96] as const;
export const DOTTED_DURATIONS: readonly DottedDuration[] = [9, 18, 36, 72] as const;
export const TRIPLET_DURATIONS: readonly TripletDuration[] = [8, 16] as const;
export const SIXTUPLET_DURATIONS: readonly SixtupletDuration[] = [2, 4] as const;
export const TUPLET_DURATIONS: readonly DurationValue[] = [
	...TRIPLET_DURATIONS,
	...SIXTUPLET_DURATIONS,
] as const;
