/**
 * Note duration type definitions for 24-ticks/beat-grid system
 */

// Duration value constants
export const STRAIGHT_DURATIONS = [6, 12, 24, 48, 96] as const;
export const DOTTED_DURATIONS = [18, 36, 72] as const;
export const TRIPLET_DURATIONS = [8, 16] as const;

export type StraightDurationArray = typeof STRAIGHT_DURATIONS;
export type DottedDurationArray = typeof DOTTED_DURATIONS;
export type TripletDurationArray = typeof TRIPLET_DURATIONS;

export type StraightDuration = StraightDurationArray[number];
export type DottedDuration = DottedDurationArray[number];
export type TripletDuration = TripletDurationArray[number];

export type DurationValue = StraightDuration | DottedDuration | TripletDuration;
export type Duration = DurationValue;

// Duration name constants (base definitions)
export type DurationName =
	| 'Whole'
	| 'Dotted Half'
	| 'Half'
	| 'Dotted Quarter'
	| 'Quarter'
	| 'Dotted Eighth'
	| 'Eighth'
	| 'Sixteenth'
	| 'Quarter Triplet'
	| 'Eighth Triplet';

// Duration type configuration
export type DurationType = {
	name: DurationName;
	value: number;
};

// Duration display order for UI components
export const DURATION_DISPLAY_ORDER: readonly DurationName[] = [
	'Whole',
	'Dotted Half',
	'Half',
	'Dotted Quarter',
	'Quarter',
	'Dotted Eighth',
	'Eighth',
	'Sixteenth',
	'Quarter Triplet',
	'Eighth Triplet',
] as const;

// Mappings
export const NAME_TO_DURATION_MAP = new Map<DurationName, DurationValue>([
	['Sixteenth', 6],
	['Eighth', 12],
	['Dotted Eighth', 18],
	['Quarter', 24],
	['Dotted Quarter', 36],
	['Half', 48],
	['Dotted Half', 72],
	['Whole', 96],
	['Eighth Triplet', 8],
	['Quarter Triplet', 16],
]);

export const DURATION_TO_NAME_MAP = new Map<DurationValue, DurationName>([
	[6, 'Sixteenth'],
	[12, 'Eighth'],
	[18, 'Dotted Eighth'],
	[24, 'Quarter'],
	[36, 'Dotted Quarter'],
	[48, 'Half'],
	[72, 'Dotted Half'],
	[96, 'Whole'],
	[8, 'Eighth Triplet'],
	[16, 'Quarter Triplet'],
]);

// Lookups
export const getDurationFromName = (name: DurationName): DurationValue | undefined => {
	return NAME_TO_DURATION_MAP.get(name);
};

export const getNameFromDuration = (duration: DurationValue): DurationName | undefined => {
	return DURATION_TO_NAME_MAP.get(duration);
};

// Checks
export const isTripletDuration = (duration: DurationValue): duration is TripletDuration => {
	return [8, 16].includes(duration);
};

export const isDottedDuration = (duration: DurationValue): duration is DottedDuration => {
	return [18, 36, 72].includes(duration);
};

export const isStraightDuration = (duration: DurationValue): duration is StraightDuration => {
	return [6, 12, 24, 48, 96].includes(duration);
};
