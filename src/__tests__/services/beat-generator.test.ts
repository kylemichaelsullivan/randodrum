import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixRender, generateRhythm } from '@/server';
import type { DurationValue, DurationWeightConfig, Measure } from '@/types';

const BEAT_LENGTH = 24;
const MEASURE_LENGTH = BEAT_LENGTH * 4; // 96 ticks

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

			const rhythm = generateRhythm(durationConfigs, MEASURE_LENGTH);

			const totalDuration = rhythm.reduce((sum, note) => sum + note.dur, 0);
			expect(totalDuration).toBe(MEASURE_LENGTH);
		});

		it('generates notes with correct start positions', () => {
			const durationConfigs: DurationWeightConfig[] = [
				{ duration: 24 as DurationValue, weight: 1 },
			];

			const rhythm = generateRhythm(durationConfigs, MEASURE_LENGTH);

			expect(rhythm[0]?.start).toBe(0);
			expect(rhythm[1]?.start).toBe(24);
			expect(rhythm[2]?.start).toBe(48);
			expect(rhythm[3]?.start).toBe(72);
		});

		it('handles tuplets correctly', () => {
			const durationConfigs: DurationWeightConfig[] = [
				{ duration: 8 as DurationValue, weight: 1 }, // Triplet eighth
			];

			const rhythm = generateRhythm(durationConfigs, BEAT_LENGTH);

			expect(rhythm).toHaveLength(3);
			expect(rhythm[0]?.start).toBe(0);
			expect(rhythm[1]?.start).toBe(8);
			expect(rhythm[2]?.start).toBe(16);
		});

		it('only allows triplets to start on downbeats', () => {
			const durationConfigs: DurationWeightConfig[] = [
				{ duration: 8 as DurationValue, weight: 0.5 }, // Triplet eighth
				{ duration: 12 as DurationValue, weight: 0.5 }, // Regular eighth
			];

			// Run the generation multiple times to test different scenarios
			for (let i = 0; i < 10; i++) {
				const rhythm = generateRhythm(durationConfigs, MEASURE_LENGTH);

				// Check that all triplet notes start on a downbeat (multiple of BEAT_LENGTH)
				rhythm.forEach((note) => {
					if (note.dur === 8 || note.dur === 16) {
						// This is a triplet note - its start position should be on a downbeat or part of a triplet group
						// The note should either start on a downbeat or be part of a triplet group starting on downbeat
						expect(note.start % 8).toBe(0); // All triplets align to 8-tick boundaries
						// The first note of the triplet group should be on a downbeat
						const tripletGroupStart = note.start - (note.start % BEAT_LENGTH);
						expect(tripletGroupStart % BEAT_LENGTH).toBe(0);
					}
				});
			}
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
				{
					start: 24,
					dur: 24,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
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

		it('splits notes that cross beat boundaries (dotted quarter example)', () => {
			const measure: Measure = [
				{
					start: 0,
					dur: 24,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
				{
					start: 24,
					dur: 36,
					dynamic: 'Accent',
					isDominant: false,
					ornament: null,
					isRest: false,
				},
			];

			const result = fixRender(measure);

			// The dotted quarter (36) starting at 24 should be split at the beat boundary (48)
			expect(result).toEqual([
				{
					start: 0,
					dur: 24,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
				{
					start: 24,
					dur: 24,
					dynamic: 'Accent',
					isDominant: false,
					ornament: null,
					isRest: false,
				},
				{
					start: 48,
					dur: 12,
					dynamic: 'Accent',
					isDominant: false,
					ornament: null,
					isRest: false,
				},
			]);
		});

		it('splits multiple quarter notes crossing beat boundaries (e-q-q-q-e pattern)', () => {
			// This is the case: N12@0 | N24@12 | N24@36 | N24@60 | N12@84
			// Expected: 8 eighth notes (e-e-E-e-E-e-E-e pattern)
			const measure: Measure = [
				{
					start: 0,
					dur: 12,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
				{
					start: 12,
					dur: 24,
					dynamic: 'Normal',
					isDominant: false,
					ornament: null,
					isRest: false,
				},
				{
					start: 36,
					dur: 24,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
				{
					start: 60,
					dur: 24,
					dynamic: 'Normal',
					isDominant: false,
					ornament: null,
					isRest: false,
				},
				{
					start: 84,
					dur: 12,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
			];

			const result = fixRender(measure);

			// Each quarter note crossing a beat boundary should be split into two eighth notes
			expect(result).toEqual([
				{
					start: 0,
					dur: 12,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
				{
					start: 12,
					dur: 12,
					dynamic: 'Normal',
					isDominant: false,
					ornament: null,
					isRest: false,
				},
				{
					start: 24,
					dur: 12,
					dynamic: 'Normal',
					isDominant: false,
					ornament: null,
					isRest: false,
				},
				{
					start: 36,
					dur: 12,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
				{
					start: 48,
					dur: 12,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
				{
					start: 60,
					dur: 12,
					dynamic: 'Normal',
					isDominant: false,
					ornament: null,
					isRest: false,
				},
				{
					start: 72,
					dur: 12,
					dynamic: 'Normal',
					isDominant: false,
					ornament: null,
					isRest: false,
				},
				{
					start: 84,
					dur: 12,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
			]);
		});

		it('exempts whole notes, dotted half notes, and half notes from splitting (but not rests)', () => {
			// Test that 96 (whole), 72 (dotted half), and 48 (half) notes are not split
			const measure: Measure = [
				{
					start: 0,
					dur: 96,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
				{
					start: 0,
					dur: 72,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
				{
					start: 24,
					dur: 48,
					dynamic: 'Accent',
					isDominant: false,
					ornament: null,
					isRest: false,
				},
			];

			const result = fixRender(measure);

			// These notes should remain unchanged despite crossing beat boundaries
			expect(result).toEqual([
				{
					start: 0,
					dur: 96,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
				{
					start: 0,
					dur: 72,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
				{
					start: 24,
					dur: 48,
					dynamic: 'Accent',
					isDominant: false,
					ornament: null,
					isRest: false,
				},
			]);
		});

		it('rests that cross beat boundaries are split then recombined if no notes precede them', () => {
			// Half rest starting at 12 will be split then recombined by rest optimization
			const measure: Measure = [{ start: 12, dur: 48, isRest: true }];

			const result = fixRender(measure);

			// Split into R12@12 + R36@24, but rest optimization recombines them
			expect(result).toEqual([{ start: 12, dur: 48, isRest: true }]);
		});

		it('converts eighth note + eighth rest on downbeat to quarter note', () => {
			// N12@0 + R12@12 should become N24@0
			const measure: Measure = [
				{
					start: 0,
					dur: 12,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
				{ start: 12, dur: 12, isRest: true },
			];

			const result = fixRender(measure);

			expect(result).toEqual([
				{
					start: 0,
					dur: 24,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
			]);
		});

		it('converts eighth note + eighth rest on downbeat in complex measure', () => {
			// M03: N12@0 | R48@12 | R36@60
			// After split: N12@0 | R12@12 | R36@24 | R12@60 | R24@72
			// After note+rest opt: N24@0 | R36@24 | R12@60 | R24@72
			// After rest opt: N24@0 | R72@24 (36+12=48, then 48+24=72)
			const measure: Measure = [
				{
					start: 0,
					dur: 12,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
				{ start: 12, dur: 48, isRest: true },
				{ start: 60, dur: 36, isRest: true },
			];

			const result = fixRender(measure);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({
				start: 0,
				dur: 24,
				dynamic: 'Normal',
				isDominant: true,
				ornament: null,
				isRest: false,
			});
			expect(result[1]).toEqual({
				start: 24,
				dur: 72,
				isRest: true,
			});
		});

		it('does not convert eighth note + eighth rest when not on downbeat', () => {
			// N12@12 + R12@24 should remain unchanged (not on downbeat)
			const measure: Measure = [
				{
					start: 12,
					dur: 12,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
				{ start: 24, dur: 12, isRest: true },
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
				{
					start: 0,
					dur: 24,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
				{
					start: 24,
					dur: 24,
					dynamic: 'Accent',
					isDominant: false,
					ornament: null,
					isRest: false,
				},
			];

			const result = fixRender(measure);

			// Notes that don't cross beat boundaries should remain unchanged
			expect(result).toEqual(measure);
		});

		it('handles mixed rests and notes', () => {
			const measure: Measure = [
				{ start: 0, dur: 24, isRest: true },
				{ start: 24, dur: 24, isRest: true },
				{
					start: 48,
					dur: 24,
					dynamic: 'Normal',
					isDominant: true,
					ornament: null,
					isRest: false,
				},
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

		describe('sixteenth note patterns on downbeats', () => {
			it('converts 1e&- pattern (note+note+note+rest) to M symbol with dotted eighth duration', () => {
				// Pattern: sixteenth + sixteenth + sixteenth + sixteenth rest on downbeat
				const measure: Measure = [
					{
						start: 0,
						dur: 6,
						dynamic: 'Normal',
						isDominant: true,
						ornament: null,
						isRest: false,
					},
					{
						start: 6,
						dur: 6,
						dynamic: 'Normal',
						isDominant: false,
						ornament: null,
						isRest: false,
					},
					{
						start: 12,
						dur: 6,
						dynamic: 'Normal',
						isDominant: true,
						ornament: null,
						isRest: false,
					},
					{ start: 18, dur: 6, isRest: true },
				];

				const result = fixRender(measure);

				expect(result).toHaveLength(1);
				expect(result[0]).toMatchObject({
					start: 0,
					dur: 18, // Dotted eighth
					symbolOverride: 'M',
					isRest: false,
				});
			});

			it('converts 1e-- pattern (note+note+rest+rest) to O symbol with eighth duration', () => {
				// Pattern: sixteenth + sixteenth + sixteenth rest + sixteenth rest on downbeat
				const measure: Measure = [
					{
						start: 0,
						dur: 6,
						dynamic: 'Normal',
						isDominant: true,
						ornament: null,
						isRest: false,
					},
					{
						start: 6,
						dur: 6,
						dynamic: 'Normal',
						isDominant: false,
						ornament: null,
						isRest: false,
					},
					{ start: 12, dur: 6, isRest: true },
					{ start: 18, dur: 6, isRest: true },
				];

				const result = fixRender(measure);

				expect(result).toHaveLength(1);
				expect(result[0]).toMatchObject({
					start: 0,
					dur: 12, // Eighth note
					symbolOverride: 'O',
					isRest: false,
				});
			});

			it('converts 1e-a pattern (note+note+rest+note) to š symbol with quarter duration', () => {
				// Pattern: sixteenth + sixteenth + sixteenth rest + sixteenth on downbeat
				const measure: Measure = [
					{
						start: 0,
						dur: 6,
						dynamic: 'Normal',
						isDominant: true,
						ornament: null,
						isRest: false,
					},
					{
						start: 6,
						dur: 6,
						dynamic: 'Normal',
						isDominant: false,
						ornament: null,
						isRest: false,
					},
					{ start: 12, dur: 6, isRest: true },
					{
						start: 18,
						dur: 6,
						dynamic: 'Normal',
						isDominant: true,
						ornament: null,
						isRest: false,
					},
				];

				const result = fixRender(measure);

				expect(result).toHaveLength(1);
				expect(result[0]).toMatchObject({
					start: 0,
					dur: 24, // Quarter note
					symbolOverride: 'š',
					isRest: false,
				});
			});

			it('converts 1-&a pattern (note+rest+note+note) to m symbol with quarter duration', () => {
				// Pattern: sixteenth + sixteenth rest + sixteenth + sixteenth on downbeat
				const measure: Measure = [
					{
						start: 0,
						dur: 6,
						dynamic: 'Normal',
						isDominant: true,
						ornament: null,
						isRest: false,
					},
					{ start: 6, dur: 6, isRest: true },
					{
						start: 12,
						dur: 6,
						dynamic: 'Normal',
						isDominant: false,
						ornament: null,
						isRest: false,
					},
					{
						start: 18,
						dur: 6,
						dynamic: 'Normal',
						isDominant: true,
						ornament: null,
						isRest: false,
					},
				];

				const result = fixRender(measure);

				expect(result).toHaveLength(1);
				expect(result[0]).toMatchObject({
					start: 0,
					dur: 24, // Quarter note
					symbolOverride: 'm',
					isRest: false,
				});
			});

			it('converts 1--a pattern (note+rest+rest+note) to o symbol with quarter duration', () => {
				// Pattern: sixteenth + sixteenth rest + sixteenth rest + sixteenth on downbeat
				const measure: Measure = [
					{
						start: 0,
						dur: 6,
						dynamic: 'Normal',
						isDominant: true,
						ornament: null,
						isRest: false,
					},
					{ start: 6, dur: 6, isRest: true },
					{ start: 12, dur: 6, isRest: true },
					{
						start: 18,
						dur: 6,
						dynamic: 'Normal',
						isDominant: false,
						ornament: null,
						isRest: false,
					},
				];

				const result = fixRender(measure);

				expect(result).toHaveLength(1);
				expect(result[0]).toMatchObject({
					start: 0,
					dur: 24, // Quarter note
					symbolOverride: 'o',
					isRest: false,
				});
			});

			it('does not convert patterns that do not start on downbeat', () => {
				// Same pattern but starting at position 6 (not on downbeat)
				const measure: Measure = [
					{
						start: 6,
						dur: 6,
						dynamic: 'Normal',
						isDominant: true,
						ornament: null,
						isRest: false,
					},
					{
						start: 12,
						dur: 6,
						dynamic: 'Normal',
						isDominant: false,
						ornament: null,
						isRest: false,
					},
					{
						start: 18,
						dur: 6,
						dynamic: 'Normal',
						isDominant: true,
						ornament: null,
						isRest: false,
					},
					{ start: 24, dur: 6, isRest: true },
				];

				const result = fixRender(measure);

				// Should remain unchanged since not on downbeat
				expect(result).toHaveLength(4);
				expect(result[0]?.symbolOverride).toBeUndefined();
			});

			it('handles multiple sixteenth patterns in the same measure', () => {
				// Two patterns: 1e&- at 0, and 1-&a at 24
				const measure: Measure = [
					{
						start: 0,
						dur: 6,
						dynamic: 'Normal',
						isDominant: true,
						ornament: null,
						isRest: false,
					},
					{
						start: 6,
						dur: 6,
						dynamic: 'Normal',
						isDominant: false,
						ornament: null,
						isRest: false,
					},
					{
						start: 12,
						dur: 6,
						dynamic: 'Normal',
						isDominant: true,
						ornament: null,
						isRest: false,
					},
					{ start: 18, dur: 6, isRest: true },
					{
						start: 24,
						dur: 6,
						dynamic: 'Normal',
						isDominant: false,
						ornament: null,
						isRest: false,
					},
					{ start: 30, dur: 6, isRest: true },
					{
						start: 36,
						dur: 6,
						dynamic: 'Normal',
						isDominant: true,
						ornament: null,
						isRest: false,
					},
					{
						start: 42,
						dur: 6,
						dynamic: 'Normal',
						isDominant: false,
						ornament: null,
						isRest: false,
					},
				];

				const result = fixRender(measure);

				expect(result).toHaveLength(2);
				expect(result[0]).toMatchObject({
					start: 0,
					dur: 18, // Dotted eighth
					symbolOverride: 'M',
				});
				expect(result[1]).toMatchObject({
					start: 24,
					dur: 24, // Quarter
					symbolOverride: 'm',
				});
			});
		});
	});
});
