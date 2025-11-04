import { describe, it, expect } from 'vitest';
import { act } from '@testing-library/react';
import { useFormStore } from '@/stores';
import { createFormStoreTestSuite } from '@/__tests__';

import type { BeatFormData } from '@/types';

const formStoreTestSuite = createFormStoreTestSuite('FormStore', useFormStore);

describe('FormStore', () => {
	formStoreTestSuite.withStoreReset(() => {
		it('initializes with default form values', () => {
			formStoreTestSuite.testInitialValues({
				formValues: {
					beats: 4,
					measures: 4,
					difficulty: 'I’m Too Young to Drum',
				},
			});
		});

		it('updates form values partially', () => {
			const { result } = formStoreTestSuite.renderStore();

			act(() => {
				result.current.setFormValues({ beats: 8 });
			});

			expect(result.current.formValues).toEqual({
				beats: 8,
				measures: 4,
				difficulty: 'I’m Too Young to Drum',
			});
		});

		it('updates multiple form values at once', () => {
			const { result } = formStoreTestSuite.renderStore();

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
			const { result } = formStoreTestSuite.renderStore();

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
			const { result } = formStoreTestSuite.renderStore();

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
				difficulty: 'I’m Too Young to Drum',
			});
		});

		it('handles all difficulty levels', () => {
			const { result } = formStoreTestSuite.renderStore();
			const difficulties: BeatFormData['difficulty'][] = [
				'I’m Too Young to Drum',
				'Hey, Not Too Ruff',
				'Hurt Me Plenty',
				'Ultra-Violence',
				'Drumline!',
			];

			difficulties.forEach((difficulty) => {
				act(() => {
					result.current.setFormValues({ difficulty });
				});

				expect(result.current.formValues.difficulty).toBe(difficulty);
			});
		});

		it('validates form data types', () => {
			const { result } = formStoreTestSuite.renderStore();

			act(() => {
				result.current.setFormValues({
					beats: 2,
					measures: 1,
					difficulty: 'I’m Too Young to Drum',
				});
			});

			const formValues = result.current.formValues;
			expect(typeof formValues.beats).toBe('number');
			expect(typeof formValues.measures).toBe('number');
			expect(typeof formValues.difficulty).toBe('string');
		});
	});
});
