import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
	generateBeat,
	generateRhythm,
	generateHandRuns,
	addDynamics,
	addOrnaments,
	applyBalancing,
} from '@/server';
import type { BeatFormData, DifficultyLevel, DurationValue, Measure } from '@/types';
import { TUPLET_DURATIONS, isTripletDuration, isSixtupletDuration } from '@/types/duration';

describe('BeatGenerator', () => {
	beforeEach(() => {
		vi.spyOn(Math, 'random').mockReturnValue(0.5);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('generateRhythm', () => {
		it('generates rhythm that fills exactly the measure length', () => {
			const allowed: DurationValue[] = [3, 6, 12, 24];
			const measureLen = 96;

			const rhythm = generateRhythm(allowed, measureLen);

			const totalDuration = rhythm.reduce((sum, note) => sum + note.dur, 0);
			expect(totalDuration).toBe(measureLen);
		});

		it('generates notes with correct start positions', () => {
			const allowed: DurationValue[] = [24, 48]; // Quarter Notes, Half Notes
			const measureLen = 96;

			const rhythm = generateRhythm(allowed, measureLen);

			let expectedStart = 0;
			rhythm.forEach(note => {
				expect(note.start).toBe(expectedStart);
				expectedStart += note.dur;
			});
		});

		it('only uses allowed durations', () => {
			const allowed: DurationValue[] = [12, 24, 48];
			const measureLen = 96;

			const rhythm = generateRhythm(allowed, measureLen);

			rhythm.forEach(note => {
				expect(allowed).toContain(note.dur);
			});
		});
	});

	describe('generateBeat', () => {
		const beatsPerMeasure = 4;
		const ticksPerBeat = 24;
		const measureLen = beatsPerMeasure * ticksPerBeat;

		it('generates beat with correct number of measures', () => {
			const formData: BeatFormData = {
				beats: 4,
				measures: 3,
				difficulty: 'Hey, Not Too Rough',
			};

			const beat = generateBeat(formData);

			expect(beat.measures).toHaveLength(3);
			expect(beat.beatsPerMeasure).toBe(4);
			expect(beat.difficulty).toBe('Hey, Not Too Rough');
		});

		it('generates beat with correct beats per measure', () => {
			const formData: BeatFormData = {
				beats: 6,
				measures: 2,
				difficulty: 'Hey, Not Too Rough',
			};

			const beat = generateBeat(formData);

			expect(beat.beatsPerMeasure).toBe(6);
			expect(beat.measures).toHaveLength(2);
		});

		it('handles all difficulty levels', () => {
			const difficulties: DifficultyLevel[] = [
				'I’m Too Young to Drum',
				'Hey, Not Too Rough',
				'Hurt Me Plenty',
				'Ultra-Violence',
				'Drumline!',
			];

			difficulties.forEach(difficulty => {
				const formData: BeatFormData = {
					beats: 4,
					measures: 1,
					difficulty,
				};

				const beat = generateBeat(formData);

				expect(beat.difficulty).toBe(difficulty);
				expect(beat.measures).toHaveLength(1);
			});
		});

		it('generates measures with correct total duration', () => {
			const formData: BeatFormData = {
				beats: 4,
				measures: 2,
				difficulty: 'Hey, Not Too Rough',
			};

			const beat = generateBeat(formData);

			beat.measures.forEach(measure => {
				const totalDuration = measure.reduce((sum, note) => sum + note.dur, 0);
				expect(totalDuration).toBe(measureLen);
			});
		});

		it('generates notes with valid properties', () => {
			const formData: BeatFormData = {
				beats: 4,
				measures: 1,
				difficulty: 'Hurt Me Plenty',
			};

			const beat = generateBeat(formData);

			beat.measures.forEach(measure => {
				measure.forEach(note => {
					expect(note.start).toBeGreaterThanOrEqual(0);
					expect(note.start).toBeLessThan(measureLen);
					expect(note.dur).toBeGreaterThan(0);
					expect(note.dur).toBeLessThanOrEqual(measureLen);
					expect(typeof note.isDominant).toBe('boolean');
					expect(['ghost', 'normal', 'accent', 'rimshot']).toContain(note.dynamic);
					expect(['flam', 'drag', null]).toContain(note.ornament);
				});
			});
		});
	});

	describe('generateHandRuns', () => {
		it('applies sticking pattern to notes', () => {
			const measure: Measure = [
				{
					start: 0,
					dur: 8 as DurationValue,
					isDominant: true,
					dynamic: 'normal' as const,
					ornament: null,
				},
				{
					start: 8,
					dur: 8 as DurationValue,
					isDominant: true,
					dynamic: 'normal' as const,
					ornament: null,
				},
				{
					start: 16,
					dur: 8 as DurationValue,
					isDominant: true,
					dynamic: 'normal' as const,
					ornament: null,
				},
				{
					start: 24,
					dur: 8 as DurationValue,
					isDominant: true,
					dynamic: 'normal' as const,
					ornament: null,
				},
			];

			const result = generateHandRuns(measure, {
				durations: [4, 8, 16] as DurationValue[],
				restProbability: 0.1,
				runLengths: { 1: 0.5, 2: 0.5 },
				switchProb: 0.5,
				dynamicScale: [2, 7, 9, 10],
				flamThreshold: 0.1,
				dragThreshold: 0.1,
				allowBalancing: false,
			});

			const dominantCount = result.filter(note => note.isDominant).length;
			expect(dominantCount).toBeGreaterThan(0);
			expect(dominantCount).toBeLessThanOrEqual(result.length);
		});
	});

	describe('addDynamics', () => {
		it('applies dynamics based on scale', () => {
			const measure: Measure = [
				{
					start: 0,
					dur: 8 as DurationValue,
					isDominant: true,
					dynamic: 'normal' as const,
					ornament: null,
				},
				{
					start: 8,
					dur: 8 as DurationValue,
					isDominant: false,
					dynamic: 'normal' as const,
					ornament: null,
				},
			];

			const result = addDynamics(measure, {
				durations: [4, 8, 16] as DurationValue[],
				restProbability: 0.1,
				runLengths: { 1: 0.5 },
				switchProb: 0.5,
				dynamicScale: [2, 7, 9, 10],
				flamThreshold: 0.1,
				dragThreshold: 0.1,
				allowBalancing: false,
			});

			result.forEach(note => {
				expect(['ghost', 'normal', 'accent', 'rimshot']).toContain(note.dynamic);
			});
		});
	});

	describe('addOrnaments', () => {
		it('applies ornaments based on thresholds', () => {
			const measure: Measure = [
				{
					start: 0,
					dur: 8 as DurationValue,
					isDominant: true,
					dynamic: 'normal' as const,
					ornament: null,
				},
				{
					start: 8,
					dur: 8 as DurationValue,
					isDominant: false,
					dynamic: 'normal' as const,
					ornament: null,
				},
			];

			const result = addOrnaments(measure, {
				durations: [4, 8, 16] as DurationValue[],
				restProbability: 0.1,
				runLengths: { 1: 0.5 },
				switchProb: 0.5,
				dynamicScale: [2, 7, 9, 10],
				flamThreshold: 0.5,
				dragThreshold: 0.3,
				allowBalancing: false,
			});

			result.forEach(note => {
				expect(['flam', 'drag', null]).toContain(note.ornament);
			});
		});
	});

	describe('applyBalancing', () => {
		it('balances hand distribution when enabled', () => {
			const measure: Measure = [
				{
					start: 0,
					dur: 8 as DurationValue,
					isDominant: true,
					dynamic: 'normal' as const,
					ornament: null,
				},
				{
					start: 8,
					dur: 8 as DurationValue,
					isDominant: true,
					dynamic: 'normal' as const,
					ornament: null,
				},
				{
					start: 16,
					dur: 8 as DurationValue,
					isDominant: true,
					dynamic: 'normal' as const,
					ornament: null,
				},
				{
					start: 24,
					dur: 8 as DurationValue,
					isDominant: true,
					dynamic: 'normal' as const,
					ornament: null,
				},
			];

			const result = applyBalancing(measure, {
				durations: [4, 8, 16] as DurationValue[],
				restProbability: 0.1,
				runLengths: { 1: 0.5 },
				switchProb: 0.5,
				dynamicScale: [2, 7, 9, 10],
				flamThreshold: 0.1,
				dragThreshold: 0.1,
				allowBalancing: true,
				maxClump: 2,
				minRatio: 0.3,
				maxRatio: 0.7,
			});

			const dominantCount = result.filter(note => note.isDominant).length;
			const totalCount = result.length;
			const ratio = dominantCount / totalCount;

			expect(ratio).toBeGreaterThanOrEqual(0.3);
			expect(ratio).toBeLessThanOrEqual(0.7);
		});

		it('does not balance when disabled', () => {
			const measure: Measure = [
				{
					start: 0,
					dur: 8 as DurationValue,
					isDominant: true,
					dynamic: 'normal' as const,
					ornament: null,
				},
				{
					start: 8,
					dur: 8 as DurationValue,
					isDominant: true,
					dynamic: 'normal' as const,
					ornament: null,
				},
				{
					start: 16,
					dur: 8 as DurationValue,
					isDominant: true,
					dynamic: 'normal' as const,
					ornament: null,
				},
				{
					start: 24,
					dur: 8 as DurationValue,
					isDominant: true,
					dynamic: 'normal' as const,
					ornament: null,
				},
			];

			const result = applyBalancing(measure, {
				durations: [4, 8, 16] as DurationValue[],
				restProbability: 0.1,
				runLengths: { 1: 0.5 },
				switchProb: 0.5,
				dynamicScale: [2, 7, 9, 10],
				flamThreshold: 0.1,
				dragThreshold: 0.1,
				allowBalancing: false,
			});

			// Should remain unchanged
			expect(result).toEqual(measure);
		});
	});

	describe('tuplet grouping', () => {
		it('groups eighth sixtuplets in sets of 6', () => {
			const allowed: DurationValue[] = [4]; // Eighth Sixtuplet (6 hits over 1 beat)
			const measureLen = 24; // Exactly 6 Eighth Sixtuplets

			const rhythm = generateRhythm(allowed, measureLen);

			expect(rhythm).toHaveLength(6);

			rhythm.forEach(note => {
				expect(note.dur).toBe(4);
			});

			const totalDuration = rhythm.reduce((sum, note) => sum + note.dur, 0);
			expect(totalDuration).toBe(24);
		});

		it('groups sixteenth sixtuplets in sets of 6', () => {
			const allowed: DurationValue[] = [2]; // Sixteenth Sixtuplet (6 hits over 1/2 beat)
			const measureLen = 12; // Exactly 6 Sixteenth Sixtuplets

			const rhythm = generateRhythm(allowed, measureLen);

			expect(rhythm).toHaveLength(6);

			rhythm.forEach(note => {
				expect(note.dur).toBe(2);
			});

			const totalDuration = rhythm.reduce((sum, note) => sum + note.dur, 0);
			expect(totalDuration).toBe(12);
		});

		it('groups quarter triplets in sets of 3', () => {
			const allowed: DurationValue[] = [16]; // Quarter Triplet (3 hits over 2 beats)
			const measureLen = 48; // Exactly 3 Quarter Triplets

			const rhythm = generateRhythm(allowed, measureLen);

			expect(rhythm).toHaveLength(3);

			rhythm.forEach(note => {
				expect(note.dur).toBe(16);
			});

			const totalDuration = rhythm.reduce((sum, note) => sum + note.dur, 0);
			expect(totalDuration).toBe(48);
		});

		it('groups eighth triplets in sets of 3', () => {
			const allowed: DurationValue[] = [8]; // Eighth Triplet (3 hits over 1 beat)
			const measureLen = 24; // Exactly 3 Eighth Triplets

			const rhythm = generateRhythm(allowed, measureLen);

			expect(rhythm).toHaveLength(3);

			rhythm.forEach(note => {
				expect(note.dur).toBe(8);
			});

			const totalDuration = rhythm.reduce((sum, note) => sum + note.dur, 0);
			expect(totalDuration).toBe(24);
		});

		it('handles mixed tuplet combinations', () => {
			const allowed: DurationValue[] = [...TUPLET_DURATIONS];
			const measureLen = 96;

			const rhythm = generateRhythm(allowed, measureLen);

			const totalDuration = rhythm.reduce((sum, note) => sum + note.dur, 0);
			expect(totalDuration).toBe(96);

			let i = 0;
			while (i < rhythm.length) {
				const note = rhythm[i]!;
				const groupSize = isTripletDuration(note.dur) ? 3 : 6;

				for (let j = 0; j < groupSize && i + j < rhythm.length; j++) {
					expect(rhythm[i + j]!.dur).toBe(note.dur);
				}
				i += groupSize;
			}
		});

		it('generates specific tuplet combinations', () => {
			const allowed: DurationValue[] = [...TUPLET_DURATIONS];

			for (let measureNum = 0; measureNum < 10; measureNum++) {
				const measureLen = 96; // 4 beats
				const rhythm = generateRhythm(allowed, measureLen);

				const totalDuration = rhythm.reduce((sum, note) => sum + note.dur, 0);
				expect(totalDuration).toBe(96);

				let i = 0;
				while (i < rhythm.length) {
					const note = rhythm[i]!;
					const groupSize = isTripletDuration(note.dur) ? 3 : 6; // Triplets or Sixtuplets

					for (let j = 0; j < groupSize && i + j < rhythm.length; j++) {
						expect(rhythm[i + j]!.dur).toBe(note.dur);
					}
					i += groupSize;
				}
			}
		});

		it('allows mixed tuplet combinations with partial groups', () => {
			const allowed: DurationValue[] = [...TUPLET_DURATIONS];
			const measureLen = 48;

			for (let measureNum = 0; measureNum < 10; measureNum++) {
				const rhythm = generateRhythm(allowed, measureLen);
				const totalDuration = rhythm.reduce((sum, note) => sum + note.dur, 0);

				expect(totalDuration).toBe(48);

				let i = 0;
				while (i < rhythm.length) {
					const note = rhythm[i]!;
					const groupSize = isTripletDuration(note.dur) ? 3 : 6;

					let consecutiveCount = 0;
					while (
						i + consecutiveCount < rhythm.length &&
						rhythm[i + consecutiveCount]!.dur === note.dur
					) {
						consecutiveCount++;
					}

					if (isTripletDuration(note.dur) || isSixtupletDuration(note.dur)) {
						if (consecutiveCount < groupSize) {
							expect(i + consecutiveCount).toBe(rhythm.length);
						} else {
							expect(consecutiveCount % groupSize).toBe(0);
						}
					}

					i += consecutiveCount;
				}
			}
		});

		it('produces mixed tuplet combinations when measure length forces it', () => {
			// Use a measure length that doesn't divide evenly by common tuplet groups
			// 20 units = 2 Eighth Triplets (16) + 1 Eighth Sixtuplet (4) = 20
			const allowed: DurationValue[] = [8, 4]; // Eighth Triplet, Eighth Sixtuplet
			const measureLen = 20;

			let foundMixedCombination = false;

			for (let measureNum = 0; measureNum < 20; measureNum++) {
				const rhythm = generateRhythm(allowed, measureLen);
				const totalDuration = rhythm.reduce((sum, note) => sum + note.dur, 0);

				expect(totalDuration).toBe(20);

				const pattern = rhythm
					.map(n => {
						if (n.dur === 8) return 'e3';
						if (n.dur === 4) return 'e6';
						return '?';
					})
					.join('-');

				const hasE3 = pattern.includes('e3');
				const hasE6 = pattern.includes('e6');

				if (hasE3 && hasE6) {
					foundMixedCombination = true;
				}
			}

			expect(foundMixedCombination).toBe(true);
		});
	});
});
