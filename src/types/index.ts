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
export { COLORS, color } from './color';
export type { Color } from './color';

// Difficulty types
export type { DifficultyConfig, DifficultyLevel } from './difficulty';

// Dynamic types
export type { Dynamic, DynamicConfig, DynamicName, DynamicScale } from './dynamic';

// Duration types
export type { Duration, DurationConfig, DurationValue } from './duration';

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

// Note type definitions
export type { NoteType, NoteTypeName } from './noteType';

// Ornament types
export type { Ornament, OrnamentConfig, OrnamentName } from './ornament';

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
