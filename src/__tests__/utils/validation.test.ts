/**
 * Tests for the validation system
 */

import { describe, it, expect } from 'vitest';
import {
	// Validation functions
	validateDifficultyLevel,
	validateDurationValue,
	validateDynamicName,
	validateOrnamentName,
	validateNote,
	validateMeasure,
	validateBeatFormData,
	validateGeneratedBeat,
	// Type guards
	isDifficultyLevel,
	isDurationValue,
	isDynamicName,
	isOrnamentName,
	isNote,
	isMeasure,
	isBeatFormData,
	isGeneratedBeat,
} from '@/utils/validation';

describe('Validation Functions', () => {
	describe('validateDifficultyLevel', () => {
		it('returns success for valid difficulty level', () => {
			const result = validateDifficultyLevel('Hey, Not Too Ruff');
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toBe('Hey, Not Too Ruff');
			}
		});

		it('returns error for invalid difficulty level', () => {
			const result = validateDifficultyLevel('Invalid Level');
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toContain('Invalid difficulty level');
			}
		});
	});

	describe('validateDurationValue', () => {
		it('returns success for valid duration value', () => {
			const result = validateDurationValue(24);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toBe(24);
			}
		});

		it('returns error for invalid duration value', () => {
			const result = validateDurationValue(0.1);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toContain('Invalid duration value');
			}
		});
	});

	describe('validateDynamicName', () => {
		it('returns success for valid dynamic name', () => {
			const result = validateDynamicName('Accent');
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toBe('Accent');
			}
		});

		it('returns error for invalid dynamic name', () => {
			const result = validateDynamicName('Invalid Dynamic');
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toContain('Invalid dynamic name');
			}
		});
	});

	describe('validateOrnamentName', () => {
		it('returns success for valid ornament name', () => {
			const result = validateOrnamentName('Flam');
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toBe('Flam');
			}
		});

		it('returns success for null ornament name', () => {
			const result = validateOrnamentName(null);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toBe(null);
			}
		});

		it('returns error for invalid ornament name', () => {
			const result = validateOrnamentName('Invalid Ornament');
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toContain('Invalid ornament name');
			}
		});
	});

	describe('validateNote', () => {
		it('returns success for valid note', () => {
			const validNote = {
				start: 0,
				dur: 24,
				isRest: false,
				dynamic: 'Normal',
				isDominant: true,
				ornament: null,
			};
			const result = validateNote(validNote);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(validNote);
			}
		});

		it('returns error for invalid note', () => {
			const invalidNote = {
				start: -1, // Invalid: negative start time
				dur: 24,
				dynamic: 'Normal',
				isDominant: true,
				ornament: null,
			};
			const result = validateNote(invalidNote);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toContain('Invalid note data');
			}
		});
	});

	describe('validateMeasure', () => {
		it('returns success for valid measure', () => {
			const validMeasure = [
				{
					start: 0,
					dur: 24,
					isRest: false,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
				},
				{
					start: 24,
					dur: 24,
					isRest: false,
					dynamic: 'Accent',
					isDominant: false,
					ornament: 'Flam',
				},
			];
			const result = validateMeasure(validMeasure);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(validMeasure);
			}
		});

		it('returns error for invalid measure', () => {
			const invalidMeasure = [
				{
					start: 0,
					dur: 24,
					isRest: false,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
				},
				{
					start: -24, // Invalid: negative start time
					dur: 24,
					dynamic: 'Accent',
					isDominant: false,
					ornament: 'Flam',
				},
			];
			const result = validateMeasure(invalidMeasure);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toContain('Invalid measure data');
			}
		});
	});

	describe('validateBeatFormData', () => {
		it('returns success for valid beat form data', () => {
			const validData = {
				beats: 4,
				measures: 4,
				difficulty: 'Hey, Not Too Ruff',
			};
			const result = validateBeatFormData(validData);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(validData);
			}
		});

		it('returns error for invalid beat form data', () => {
			const invalidData = {
				beats: 0, // Invalid: beats must be >= 1
				measures: 4,
				difficulty: 'Hey, Not Too Ruff',
			};
			const result = validateBeatFormData(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toContain('Invalid beat form data');
			}
		});
	});

	describe('validateGeneratedBeat', () => {
		it('returns success for valid generated beat', () => {
			const validBeat = {
				measures: [
					[
						{
							start: 0,
							dur: 24,
							isRest: false,
							dynamic: 'Normal',
							isDominant: true,
							ornament: null,
						},
					],
				],
				beatsPerMeasure: 4,
				difficulty: 'Hey, Not Too Ruff',
			};
			const result = validateGeneratedBeat(validBeat);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(validBeat);
			}
		});

		it('returns error for invalid generated beat', () => {
			const invalidBeat = {
				measures: [
					[
						{
							start: 0,
							dur: 24,
							dynamic: 'Normal',
							isDominant: true,
							ornament: null,
						},
					],
				],
				beatsPerMeasure: 0, // Invalid: beatsPerMeasure must be >= 1
				difficulty: 'Hey, Not Too Ruff',
			};
			const result = validateGeneratedBeat(invalidBeat);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toContain('Invalid generated beat data');
			}
		});
	});
});

describe('Type Guards', () => {
	describe('isDifficultyLevel', () => {
		it('returns true for valid difficulty level', () => {
			expect(isDifficultyLevel('Hey, Not Too Ruff')).toBe(true);
		});

		it('returns false for invalid difficulty level', () => {
			expect(isDifficultyLevel('Invalid Level')).toBe(false);
		});
	});

	describe('isDurationValue', () => {
		it('returns true for valid duration value', () => {
			expect(isDurationValue(24)).toBe(true);
		});

		it('returns false for invalid duration value', () => {
			expect(isDurationValue(0.1)).toBe(false);
		});
	});

	describe('isDynamicName', () => {
		it('returns true for valid dynamic name', () => {
			expect(isDynamicName('Accent')).toBe(true);
		});

		it('returns false for invalid dynamic name', () => {
			expect(isDynamicName('Invalid Dynamic')).toBe(false);
		});
	});

	describe('isOrnamentName', () => {
		it('returns true for valid ornament name', () => {
			expect(isOrnamentName('Flam')).toBe(true);
		});

		it('returns true for null ornament name', () => {
			expect(isOrnamentName(null)).toBe(true);
		});

		it('returns false for invalid ornament name', () => {
			expect(isOrnamentName('Invalid Ornament')).toBe(false);
		});
	});

	describe('isNote', () => {
		it('returns true for valid note', () => {
			const validNote = {
				start: 0,
				dur: 24,
				isRest: false,
				dynamic: 'Normal',
				isDominant: true,
				ornament: null,
			};
			expect(isNote(validNote)).toBe(true);
		});

		it('returns false for invalid note', () => {
			const invalidNote = {
				start: -1,
				dur: 24,
				dynamic: 'Normal',
				isDominant: true,
				ornament: null,
			};
			expect(isNote(invalidNote)).toBe(false);
		});
	});

	describe('isMeasure', () => {
		it('returns true for valid measure', () => {
			const validMeasure = [
				{
					start: 0,
					dur: 24,
					isRest: false,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
				},
			];
			expect(isMeasure(validMeasure)).toBe(true);
		});

		it('returns false for invalid measure', () => {
			const invalidMeasure = [
				{
					start: -1,
					dur: 24,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
				},
			];
			expect(isMeasure(invalidMeasure)).toBe(false);
		});
	});

	describe('isBeatFormData', () => {
		it('returns true for valid beat form data', () => {
			const validData = {
				beats: 4,
				measures: 4,
				difficulty: 'Hey, Not Too Ruff',
			};
			expect(isBeatFormData(validData)).toBe(true);
		});

		it('returns false for invalid beat form data', () => {
			const invalidData = {
				beats: 0,
				measures: 4,
				difficulty: 'Hey, Not Too Ruff',
			};
			expect(isBeatFormData(invalidData)).toBe(false);
		});
	});

	describe('isGeneratedBeat', () => {
		it('returns true for valid generated beat', () => {
			const validBeat = {
				measures: [
					[
						{
							start: 0,
							dur: 24,
							isRest: false,
							dynamic: 'Normal',
							isDominant: true,
							ornament: null,
						},
					],
				],
				beatsPerMeasure: 4,
				difficulty: 'Hey, Not Too Ruff',
			};
			expect(isGeneratedBeat(validBeat)).toBe(true);
		});

		it('returns false for invalid generated beat', () => {
			const invalidBeat = {
				measures: [
					[
						{
							start: 0,
							dur: 24,
							dynamic: 'Normal',
							isDominant: true,
							ornament: null,
						},
					],
				],
				beatsPerMeasure: 0,
				difficulty: 'Hey, Not Too Ruff',
			};
			expect(isGeneratedBeat(invalidBeat)).toBe(false);
		});
	});
});
