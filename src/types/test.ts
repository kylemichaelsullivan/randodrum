/**
 * Test-specific types and utilities
 */

import type { BeatFormData, GeneratedBeat, Measure, Note } from './beat';

// Test data types (re-exported for test isolation)
export type {
	Note as TestNote,
	Measure as TestMeasure,
	GeneratedBeat as TestGeneratedBeat,
	BeatFormData as TestBeatFormData,
};

export type MockFunction<T extends (...args: unknown[]) => unknown> = {
	(...args: Parameters<T>): ReturnType<T>;
	mockResolvedValue: (value: ReturnType<T>) => MockFunction<T>;
	mockRejectedValue: (error: Error) => MockFunction<T>;
	mockReturnValue: (value: ReturnType<T>) => MockFunction<T>;
	mockImplementation: (fn: T) => MockFunction<T>;
	mockClear: () => void;
	mockReset: () => void;
};

export type TestConfig = {
	timeout?: number;
	retries?: number;
	parallel?: boolean;
};

export type TestResult<T = unknown> = {
	success: boolean;
	data?: T;
	error?: string;
	duration: number;
};

export type TestSuite = {
	name: string;
	tests: TestCase[];
	beforeAll?: () => void | Promise<void>;
	afterAll?: () => void | Promise<void>;
	beforeEach?: () => void | Promise<void>;
	afterEach?: () => void | Promise<void>;
};

export type TestCase = {
	name: string;
	fn: () => void | Promise<void>;
	timeout?: number;
	skip?: boolean;
	only?: boolean;
};

export type TestDataFactory<T> = {
	create: (overrides?: Partial<T>) => T;
	createMany: (count: number, overrides?: Partial<T>) => T[];
};

export type BeatTestDataFactory = TestDataFactory<GeneratedBeat>;
export type NoteTestDataFactory = TestDataFactory<Note>;
export type MeasureTestDataFactory = TestDataFactory<Measure>;
export type FormDataTestDataFactory = TestDataFactory<BeatFormData>;
