/**
 * Standardized test imports to reduce duplication across test files
 * This utility provides common import patterns used in tests
 */

// Core testing imports
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook, render, screen, fireEvent } from '@testing-library/react';

// Re-export for external use
export { describe, it, expect, beforeEach, afterEach, vi };
export { act, renderHook, render, screen, fireEvent };

// Common test utilities
export { createFormStoreTestSuite, createBeatStoreTestSuite } from './store-test-utils';

// Mock data
export { mockGeneratedBeat, mockUltraViolenceBeat, mockBeatFormData } from '../fixtures';

// Store hooks
export { useFormStore, useBeatStore } from '@/stores';

// Types
export type { BeatFormData, GeneratedBeat, Note, Measure } from '@/types';

/**
 * Common test setup patterns
 */
export const createTestSetup = () => {
	return {
		cleanup: () => {
			// Common cleanup logic
		},
	};
};

/**
 * Standard test imports for component testing
 */
export const COMPONENT_TEST_IMPORTS = {
	describe,
	it,
	expect,
	render,
	screen,
	fireEvent,
	beforeEach,
	afterEach,
} as const;

/**
 * Standard test imports for store testing
 */
export const STORE_TEST_IMPORTS = {
	describe,
	it,
	expect,
	act,
	renderHook,
	beforeEach,
	afterEach,
} as const;

/**
 * Standard test imports for integration testing
 */
export const INTEGRATION_TEST_IMPORTS = {
	describe,
	it,
	expect,
	render,
	screen,
	fireEvent,
	act,
	renderHook,
	beforeEach,
	afterEach,
} as const;
