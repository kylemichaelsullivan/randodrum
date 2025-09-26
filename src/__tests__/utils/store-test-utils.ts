import { act, renderHook } from '@testing-library/react';
import { beforeEach, expect } from 'vitest';
import type { StoreApi, UseBoundStore } from 'zustand';

/**
 * Creates a test suite for a Zustand store with common patterns
 */
export const createStoreTestSuite = <T extends Record<string, any>>(
	storeName: string,
	store: UseBoundStore<StoreApi<T>>
) => {
	const resetStore = () => {
		act(() => {
			// Try common reset method names
			const state = store.getState();
			if ('reset' in state && typeof state.reset === 'function') {
				state.reset();
			} else if ('resetValues' in state && typeof state.resetValues === 'function') {
				state.resetValues();
			} else if ('resetFormValues' in state && typeof state.resetFormValues === 'function') {
				state.resetFormValues();
			} else if ('clearBeat' in state && typeof state.clearBeat === 'function') {
				state.clearBeat();
			}
		});
	};

	const withStoreReset = (testFn: () => void) => {
		beforeEach(() => {
			resetStore();
		});
		testFn();
	};

	const renderStore = () => {
		return renderHook(() => store());
	};

	return {
		resetStore,
		withStoreReset,
		renderStore,
		storeName,
	};
};

/**
 * Common test patterns for form stores
 */
export const createFormStoreTestSuite = <T extends Record<string, any>>(
	storeName: string,
	store: UseBoundStore<StoreApi<T>>
) => {
	const baseSuite = createStoreTestSuite(storeName, store);

	const testInitialValues = (expectedValues: Partial<T>) => {
		const { result } = baseSuite.renderStore();
		expect(result.current).toMatchObject(expectedValues);
	};

	const testPartialUpdate = (updateData: Partial<T>, expectedResult: Partial<T>) => {
		const { result } = baseSuite.renderStore();

		act(() => {
			if ('setFormValues' in result.current && typeof result.current.setFormValues === 'function') {
				result.current.setFormValues(updateData);
			} else if ('setValues' in result.current && typeof result.current.setValues === 'function') {
				result.current.setValues(updateData);
			}
		});

		expect(result.current).toMatchObject(expectedResult);
	};

	return {
		...baseSuite,
		testInitialValues,
		testPartialUpdate,
	};
};

/**
 * Common test patterns for beat stores
 */
export const createBeatStoreTestSuite = <T extends Record<string, any>>(
	storeName: string,
	store: UseBoundStore<StoreApi<T>>
) => {
	const baseSuite = createStoreTestSuite(storeName, store);

	const testInitialValues = (expectedValues: Partial<T>) => {
		const { result } = baseSuite.renderStore();
		expect(result.current).toMatchObject(expectedValues);
	};

	const testBeatOperations = (mockBeat: any) => {
		const { result } = baseSuite.renderStore();

		// Test setting beat
		act(() => {
			if (
				'setCurrentBeat' in result.current &&
				typeof result.current.setCurrentBeat === 'function'
			) {
				result.current.setCurrentBeat(mockBeat);
			}
		});

		expect(result.current.currentBeat).toEqual(mockBeat);

		// Test clearing beat
		act(() => {
			if ('clearBeat' in result.current && typeof result.current.clearBeat === 'function') {
				result.current.clearBeat();
			}
		});

		expect(result.current.currentBeat).toBeNull();
	};

	return {
		...baseSuite,
		testInitialValues,
		testBeatOperations,
	};
};
