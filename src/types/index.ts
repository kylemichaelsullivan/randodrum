/**
 * Central type exports for the RandoDrum application
 *
 * This file serves as the main entry point for all type definitions.
 * Types are organized by domain in separate files for better maintainability.
 */

// API types
export type { ApiError, ApiResponse, ApiSuccess, BeatGenerationResponse } from './api';

// Beat generation types
export type {
	BeatFormData,
	Exercise,
	GeneratedBeat,
	Measure,
	Note,
	NoteStart,
	Samples,
} from './beat';

// Form types
export type { BeatsFieldProps, DifficultyFieldProps, MeasuresFieldProps } from './form';

// Color types
export { COLORS } from './color';
export type { ColorName } from './color';

// Difficulty types
export type { DifficultyConfig, DifficultyLevel, DurationWeightConfig } from './difficulty';

// Dynamic types
export { DYNAMICS } from './dynamic';
export type { Dynamic, DynamicConfig, DynamicName, DynamicScale } from './dynamic';

// Duration types
export {
	DOTTED_DURATIONS,
	DURATION_DISPLAY_ORDER,
	DURATION_TO_NAME_MAP,
	NAME_TO_DURATION_MAP,
	STRAIGHT_DURATIONS,
	TRIPLET_DURATIONS,
	getDurationFromName,
	getNameFromDuration,
	isDottedDuration,
	isStraightDuration,
	isTripletDuration,
} from './durations';
export type { Duration, DurationValue, DurationType, DurationName } from './durations';

// Error handling types
export type {
	AppError,
	AsyncErrorHandler,
	BeatGenerationError,
	ErrorBoundaryProps,
	ErrorBoundaryState,
	ErrorCode,
	ErrorHandler,
	ErrorLogger,
	ErrorRecovery,
	ErrorResult,
	NetworkError,
	Result,
	StorageError,
	SuccessResult,
	ValidationError,
} from './error';

export {
	ERROR_CODES,
	createBeatGenerationError,
	createNetworkError,
	createStorageError,
	createValidationError,
} from './error';

// Symbol system
export { NOTE_SYMBOL_MAP, REST_SYMBOL_MAP, getNoteSymbol, getRestSymbol } from './symbols';
export type { NoteSymbol, RestSymbol } from './symbols';

// Ornament types
export { ORNAMENTS } from './ornament';
export type { Ornament, OrnamentConfig, OrnamentName } from './ornament';

// Type utilities
export { createConstArray, createConfigArray } from './type-utils';
export type { ConstArray, NamedConfig } from './type-utils';

// Store and state management types
export type { BeatStore, DominantHandContextType, FormStore } from './store';

// Test types
export type {
	BeatTestDataFactory,
	FormDataTestDataFactory,
	MeasureTestDataFactory,
	MockFunction,
	NoteTestDataFactory,
	TestBeatFormData,
	TestConfig,
	TestCase,
	TestDataFactory,
	TestGeneratedBeat,
	TestMeasure,
	TestNote,
	TestResult,
	TestSuite,
} from './test';

// UI-specific types
export type { ChartData, DominantHand, TechniqueTypeName } from './ui';

// Utility types
export type {
	ArrayElement,
	Brand,
	DeepPartial,
	DeepReadonly,
	Email,
	Id,
	KeysOfType,
	PartialBy,
	RequiredBy,
	Timestamp,
	UnionToIntersection,
	Url,
} from './utils';
