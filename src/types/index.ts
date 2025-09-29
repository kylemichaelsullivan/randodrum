/**
 * Central type exports for the RandoDrum application
 *
 * This file serves as the main entry point for all type definitions.
 * Types are organized by domain in separate files for better maintainability.
 */

// API types
export type { BeatGenerationResponse } from './api';

// Beat generation types
export type { BeatFormData, GeneratedBeat, Measure, Note, NoteStart } from './beat';

// Form types
export type { BeatsFieldProps, DifficultyFieldProps, MeasuresFieldProps } from './form';

// Color types
export { COLORS } from './color';
export type { ColorName } from './color';

// Difficulty types
export { DIFFICULTY_LEVELS } from './difficulty';
export type { DifficultyConfig, DifficultyLevel, DurationWeightConfig } from './difficulty';

// Dynamic types
export { DYNAMICS } from './dynamic';
export type { DynamicName, DynamicThresholds } from './dynamic';

// Duration types
export {
	DOTTED_DURATIONS,
	DURATION_DISPLAY_ORDER,
	DURATION_NAMES,
	DURATION_TO_NAME_MAP,
	DURATIONS,
	DURATION_NAME_TO_VALUE_MAP,
	STRAIGHT_DURATIONS,
	TRIPLET_DURATIONS,
	isDottedDuration,
	isStraightDuration,
	isTripletDuration,
} from './duration';
export type { Duration, DurationName, DurationType, DurationValue } from './duration';

// Symbol system
export {
	NOTE_SYMBOLS,
	NOTE_SYMBOL_MAP,
	REST_SYMBOLS,
	REST_SYMBOL_MAP,
	getNoteSymbol,
	getRestSymbol,
} from './symbol';
export type { NoteSymbol, RestSymbol } from './symbol';

// Ornament types
export { ORNAMENTS, TECHNIQUE_TYPES } from './ornament';
export type { OrnamentName, TechniqueTypeName } from './ornament';

// Type utilities
export { createConfigArray } from './type-utils';
export type { NamedConfig } from './type-utils';

// Store and state management types
export type { BeatStore, DominantHandContextType, FormStore } from './store';

// UI types
export { DOMINANT_HANDS } from './ui';
export type { ChartData, DominantHand } from './ui';
