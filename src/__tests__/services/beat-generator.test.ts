import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixRender, generateRhythm } from '@/server';
import type { DurationValue, DurationWeightConfig, Measure } from '@/types';

describe('BeatGenerator', () => {
	beforeEach(() => {
		vi.spyOn(Math, 'random').mockReturnValue(0.5);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('generateRhythm', () => {
		it('generates rhythm that fills exactly the measure length', () => {
			const durationConfigs: DurationWeightConfig[] = [
				{ duration: 24 as DurationValue, weight: 1 },
			];
			const measureLen = 96;

			const rhythm = generateRhythm(durationConfigs, measureLen);

			const totalDuration = rhythm.reduce((sum, note) => sum + note.dur, 0);
			expect(totalDuration).toBe(measureLen);
		});

		it('generates notes with correct start positions', () => {
			const durationConfigs: DurationWeightConfig[] = [
				{ duration: 24 as DurationValue, weight: 1 },
			];
			const measureLen = 96;

			const rhythm = generateRhythm(durationConfigs, measureLen);

			expect(rhythm[0]?.start).toBe(0);
			expect(rhythm[1]?.start).toBe(24);
			expect(rhythm[2]?.start).toBe(48);
			expect(rhythm[3]?.start).toBe(72);
		});

		it('handles tuplets correctly', () => {
			const durationConfigs: DurationWeightConfig[] = [
				{ duration: 8 as DurationValue, weight: 1 }, // Triplet eighth
			];
			const measureLen = 24;

			const rhythm = generateRhythm(durationConfigs, measureLen);

			expect(rhythm).toHaveLength(3);
			expect(rhythm[0]?.start).toBe(0);
			expect(rhythm[1]?.start).toBe(8);
			expect(rhythm[2]?.start).toBe(16);
		});
	});

	describe('fixRender', () => {
		it('combines two consecutive quarter rests into one half rest', () => {
			const measure: Measure = [
				{ start: 0, dur: 24, isRest: true },
				{ start: 24, dur: 24, isRest: true },
			];

			const result = fixRender(measure);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				start: 0,
				dur: 48, // Half rest (48 ticks)
				isRest: true,
			});
		});

		it('combines quarter rest + half rest into dotted half rest', () => {
			const measure: Measure = [
				{ start: 0, dur: 24, isRest: true }, // Quarter rest
				{ start: 24, dur: 48, isRest: true }, // Half rest
			];

			const result = fixRender(measure);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				start: 0,
				dur: 72, // Dotted half rest (72 ticks) - follows conventional grouping
				isRest: true,
			});
		});

		it('combines three quarter rests into dotted half rest (conventional grouping)', () => {
			const measure: Measure = [
				{ start: 0, dur: 24, isRest: true },
				{ start: 24, dur: 24, isRest: true },
				{ start: 48, dur: 24, isRest: true },
			];

			const result = fixRender(measure);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				start: 0,
				dur: 72, // Dotted half rest (72 ticks) - three-beat grouping
				isRest: true,
			});
		});

		it('combines four quarter rests into whole rest', () => {
			const measure: Measure = [
				{ start: 0, dur: 24, isRest: true },
				{ start: 24, dur: 24, isRest: true },
				{ start: 48, dur: 24, isRest: true },
				{ start: 72, dur: 24, isRest: true },
			];

			const result = fixRender(measure);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				start: 0,
				dur: 96, // Whole rest (96 ticks)
				isRest: true,
			});
		});

		it('does not combine non-consecutive rests', () => {
			const measure: Measure = [
				{ start: 0, dur: 24, isRest: true },
				{ start: 24, dur: 24, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
				{ start: 48, dur: 24, isRest: true },
			];

			const result = fixRender(measure);

			expect(result).toHaveLength(3);
			expect(result[0]).toEqual({
				start: 0,
				dur: 24,
				isRest: true,
			});
			expect(result[1]).toEqual({
				start: 24,
				dur: 24,
				dynamic: 'Normal',
				isDominant: true,
				ornament: null,
				isRest: false,
			});
			expect(result[2]).toEqual({
				start: 48,
				dur: 24,
				isRest: true,
			});
		});

		it('preserves non-rest notes unchanged', () => {
			const measure: Measure = [
				{ start: 0, dur: 24, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
				{ start: 24, dur: 48, dynamic: 'Accent', isDominant: false, ornament: null, isRest: false },
			];

			const result = fixRender(measure);

			expect(result).toEqual(measure);
		});

		it('handles empty measure', () => {
			const measure: Measure = [];

			const result = fixRender(measure);

			expect(result).toEqual([]);
		});

		it('handles measure with only one rest', () => {
			const measure: Measure = [{ start: 0, dur: 24, isRest: true }];

			const result = fixRender(measure);

			expect(result).toEqual(measure);
		});

		it('handles measure with only non-rest notes', () => {
			const measure: Measure = [
				{ start: 0, dur: 24, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
				{ start: 24, dur: 48, dynamic: 'Accent', isDominant: false, ornament: null, isRest: false },
			];

			const result = fixRender(measure);

			expect(result).toEqual(measure);
		});

		it('handles mixed rests and notes', () => {
			const measure: Measure = [
				{ start: 0, dur: 24, isRest: true },
				{ start: 24, dur: 24, isRest: true },
				{ start: 48, dur: 24, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
				{ start: 72, dur: 24, isRest: true },
			];

			const result = fixRender(measure);

			expect(result).toHaveLength(3);
			expect(result[0]).toEqual({
				start: 0,
				dur: 48, // Combined quarter rests
				isRest: true,
			});
			expect(result[1]).toEqual({
				start: 48,
				dur: 24,
				dynamic: 'Normal',
				isDominant: true,
				ornament: null,
				isRest: false,
			});
			expect(result[2]).toEqual({
				start: 72,
				dur: 24,
				isRest: true,
			});
		});

		it('handles rests that cannot be optimally combined', () => {
			// Single quarter rest should remain as-is
			const measure: Measure = [{ start: 0, dur: 24, isRest: true }];

			const result = fixRender(measure);

			expect(result).toEqual(measure);
		});

		it('follows conventional two-beat grouping for mixed rest durations', () => {
			// Two quarter rests should become one half rest (two-beat grouping)
			const measure: Measure = [
				{ start: 0, dur: 24, isRest: true },
				{ start: 24, dur: 24, isRest: true },
			];

			const result = fixRender(measure);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				start: 0,
				dur: 48, // Half rest - follows two-beat grouping convention
				isRest: true,
			});
		});

		it('handles special case of four consecutive rests as whole rest', () => {
			const measure: Measure = [
				{ start: 0, dur: 24, isRest: true },
				{ start: 24, dur: 24, isRest: true },
				{ start: 48, dur: 24, isRest: true },
				{ start: 72, dur: 24, isRest: true },
			];

			const result = fixRender(measure);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				start: 0,
				dur: 96,
				isRest: true,
			});
		});

		it('handles eighth rests by combining into quarter rest', () => {
			const measure: Measure = [
				{ start: 0, dur: 12, isRest: true },
				{ start: 12, dur: 12, isRest: true },
			];

			const result = fixRender(measure);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				start: 0,
				dur: 24,
				isRest: true,
			});
		});

		it('handles eighth and quarter rests by combining into dotted quarter rest', () => {
			const measure: Measure = [
				{ start: 0, dur: 12, isRest: true },
				{ start: 12, dur: 24, isRest: true },
			];

			const result = fixRender(measure);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				start: 0,
				dur: 36,
				isRest: true,
			});
		});

		it('handles three eighth rests by combining into dotted quarter rest', () => {
			const measure: Measure = [
				{ start: 0, dur: 12, isRest: true },
				{ start: 12, dur: 12, isRest: true },
				{ start: 24, dur: 12, isRest: true },
			];

			const result = fixRender(measure);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				start: 0,
				dur: 36,
				isRest: true,
			});
		});

		it('preserves total measure duration when combining rests', () => {
			const measure: Measure = [
				{ start: 0, dur: 24, isRest: true },
				{ start: 24, dur: 24, isRest: true },
				{ start: 48, dur: 24, isRest: true },
				{ start: 72, dur: 24, isRest: true },
			];

			const result = fixRender(measure);
			const originalDuration = measure.reduce((sum, note) => sum + note.dur, 0);
			const resultDuration = result.reduce((sum, note) => sum + note.dur, 0);

			expect(resultDuration).toBe(originalDuration);
			expect(resultDuration).toBe(96);
		});
	});
});
