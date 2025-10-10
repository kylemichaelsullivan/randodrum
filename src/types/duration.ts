/**
 * Note duration type definitions for 24-ticks/beat-grid system
 */

import type { NamedConfig } from './type-utils';

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

export const DURATIONS: readonly Duration[] = [
	...STRAIGHT_DURATIONS,
	...TRIPLET_DURATIONS,
	...DOTTED_DURATIONS,
] as Duration[];

export const DURATION_NAMES = [
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

export type DurationName = (typeof DURATION_NAMES)[number];

export type DurationType = NamedConfig<DurationName, number>;

export const DURATION_DISPLAY_ORDER: DurationName[] = [
	'Whole',
	'Dotted Half',
	'Half',
	'Dotted Quarter',
	'Quarter',
	'Dotted Eighth',
	'Eighth',
	'Sixteenth',
	'Eighth Triplet',
	'Quarter Triplet',
];

export const DURATION_NAME_TO_VALUE_MAP: Record<DurationName, DurationValue> = {
	Sixteenth: 6,
	'Eighth Triplet': 8,
	Eighth: 12,
	'Quarter Triplet': 16,
	'Dotted Eighth': 18,
	Quarter: 24,
	'Dotted Quarter': 36,
	Half: 48,
	'Dotted Half': 72,
	Whole: 96,
} as const;

export const DURATION_TO_NAME_MAP = new Map<DurationValue, DurationName>(
	Object.entries(DURATION_NAME_TO_VALUE_MAP).map(([name, value]) => [value, name as DurationName])
);

export const isTripletDuration = (duration: DurationValue): duration is TripletDuration =>
	TRIPLET_DURATIONS.includes(duration as TripletDuration);

export const isDottedDuration = (duration: DurationValue): duration is DottedDuration =>
	DOTTED_DURATIONS.includes(duration as DottedDuration);

export const isStraightDuration = (duration: DurationValue): duration is StraightDuration =>
	STRAIGHT_DURATIONS.includes(duration as StraightDuration);
