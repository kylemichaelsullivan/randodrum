import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useFormStore } from '@/stores/form-store';
import type { BeatFormData } from '@/types';

describe('FormStore', () => {
	beforeEach(() => {
		// Reset store state before each test
		act(() => {
			useFormStore.getState().resetFormValues();
		});
	});

	it('initializes with default form values', () => {
		const { result } = renderHook(() => useFormStore());

		expect(result.current.formValues).toEqual({
			beats: 4,
			measures: 4,
			difficulty: 'Hey, Not Too Rough',
		});
	});

	it('updates form values partially', () => {
		const { result } = renderHook(() => useFormStore());

		act(() => {
			result.current.setFormValues({ beats: 8 });
		});

		expect(result.current.formValues).toEqual({
			beats: 8,
			measures: 4,
			difficulty: 'Hey, Not Too Rough',
		});
	});

	it('updates multiple form values at once', () => {
		const { result } = renderHook(() => useFormStore());

		act(() => {
			result.current.setFormValues({
				beats: 6,
				measures: 8,
				difficulty: 'Ultra-Violence',
			});
		});

		expect(result.current.formValues).toEqual({
			beats: 6,
			measures: 8,
			difficulty: 'Ultra-Violence',
		});
	});

	it('preserves existing values when updating partially', () => {
		const { result } = renderHook(() => useFormStore());

		// First update beats
		act(() => {
			result.current.setFormValues({ beats: 6 });
		});

		// Then update difficulty
		act(() => {
			result.current.setFormValues({ difficulty: 'Hurt Me Plenty' });
		});

		expect(result.current.formValues).toEqual({
			beats: 6,
			measures: 4, // Should still be default
			difficulty: 'Hurt Me Plenty',
		});
	});

	it('resets form values to defaults', () => {
		const { result } = renderHook(() => useFormStore());

		// First change some values
		act(() => {
			result.current.setFormValues({
				beats: 8,
				measures: 6,
				difficulty: 'Drumline!',
			});
		});

		expect(result.current.formValues).toEqual({
			beats: 8,
			measures: 6,
			difficulty: 'Drumline!',
		});

		// Then reset
		act(() => {
			result.current.resetFormValues();
		});

		expect(result.current.formValues).toEqual({
			beats: 4,
			measures: 4,
			difficulty: 'Hey, Not Too Rough',
		});
	});

	it('handles all difficulty levels', () => {
		const { result } = renderHook(() => useFormStore());
		const difficulties: BeatFormData['difficulty'][] = [
			"I’m Too Young to Drum",
			'Hey, Not Too Rough',
			'Hurt Me Plenty',
			'Ultra-Violence',
			'Drumline!',
		];

		difficulties.forEach(difficulty => {
			act(() => {
				result.current.setFormValues({ difficulty });
			});

			expect(result.current.formValues.difficulty).toBe(difficulty);
		});
	});

	it('validates form data types', () => {
		const { result } = renderHook(() => useFormStore());

		act(() => {
			result.current.setFormValues({
				beats: 2,
				measures: 1,
				difficulty: "I’m Too Young to Drum",
			});
		});

		const formValues = result.current.formValues;
		expect(typeof formValues.beats).toBe('number');
		expect(typeof formValues.measures).toBe('number');
		expect(typeof formValues.difficulty).toBe('string');
	});
});
