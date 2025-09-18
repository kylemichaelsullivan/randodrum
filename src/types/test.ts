/**
 * Test-specific types and utilities
 */

import type { BeatFormData, GeneratedBeat, Measure, Note } from './beat';

// Test data types
export type TestNote = Note;
export type TestMeasure = Measure;
export type TestGeneratedBeat = GeneratedBeat;
export type TestBeatFormData = BeatFormData;

// Mock function types
export type MockFunction<T extends (...args: unknown[]) => unknown> = {
	(...args: Parameters<T>): ReturnType<T>;
	mockResolvedValue: (value: ReturnType<T>) => MockFunction<T>;
	mockRejectedValue: (error: Error) => MockFunction<T>;
	mockReturnValue: (value: ReturnType<T>) => MockFunction<T>;
	mockImplementation: (fn: T) => MockFunction<T>;
	mockClear: () => void;
	mockReset: () => void;
};

// Test configuration types
export type TestConfig = {
	timeout?: number;
	retries?: number;
	parallel?: boolean;
};

// Test result types
export type TestResult<T = unknown> = {
	success: boolean;
	data?: T;
	error?: string;
	duration: number;
};

// Test suite types
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

// Test data factory types
export type TestDataFactory<T> = {
	create: (overrides?: Partial<T>) => T;
	createMany: (count: number, overrides?: Partial<T>) => T[];
};

// Beat test data factories
export type BeatTestDataFactory = TestDataFactory<TestGeneratedBeat>;
export type NoteTestDataFactory = TestDataFactory<TestNote>;
export type MeasureTestDataFactory = TestDataFactory<TestMeasure>;
export type FormDataTestDataFactory = TestDataFactory<TestBeatFormData>;
