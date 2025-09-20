/**
 * Note duration type definitions for 24-ticks/beat-grid system
 */

import type { NoteTypeName } from './noteType';

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

export type DurationConfig = {
	value: DurationValue;
	name: NoteTypeName;
	symbol: string;
};

export const isTripletDuration = (duration: DurationValue): duration is TripletDuration => {
	return [8, 16].includes(duration);
};

export const isDottedDuration = (duration: DurationValue): duration is DottedDuration => {
	return [18, 36, 72].includes(duration);
};

export const isStraightDuration = (duration: DurationValue): duration is StraightDuration => {
	return [6, 12, 24, 48, 96].includes(duration);
};

export const isTupletDuration = (duration: DurationValue): boolean => {
	return isTripletDuration(duration);
};

export const TUPLET_DURATIONS: readonly DurationValue[] = [...TRIPLET_DURATIONS] as const;
