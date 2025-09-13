import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
	generateBeat,
	generateRhythm,
	generateHandRuns,
	addDynamics,
	addOrnaments,
	applyBalancing,
} from '@/server/beat-generator';
import type { BeatFormData, DifficultyLevel } from '@/types';

describe('BeatGenerator', () => {
	beforeEach(() => {
		// Mock Math.random for predictable tests
		vi.spyOn(Math, 'random').mockReturnValue(0.5);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('generateRhythm', () => {
		it('generates rhythm that fills exactly the measure length', () => {
			const allowed = [1, 2, 4, 8];
			const measureLen = 32;

			const rhythm = generateRhythm(allowed, measureLen);

			const totalDuration = rhythm.reduce((sum, note) => sum + note.dur, 0);
			expect(totalDuration).toBe(measureLen);
		});

		it('generates notes with correct start positions', () => {
			const allowed = [8, 16];
			const measureLen = 32;

			const rhythm = generateRhythm(allowed, measureLen);

			let expectedStart = 0;
			rhythm.forEach(note => {
				expect(note.start).toBe(expectedStart);
				expectedStart += note.dur;
			});
		});

		it('only uses allowed durations', () => {
			const allowed = [4, 8, 16];
			const measureLen = 32;

			const rhythm = generateRhythm(allowed, measureLen);

			rhythm.forEach(note => {
				expect(allowed).toContain(note.dur);
			});
		});
	});

	describe('generateBeat', () => {
		it('generates beat with correct number of measures', () => {
			const formData: BeatFormData = {
				beats: 4,
				measures: 3,
				difficulty: 'I’m Too Young to Drum',
			};

			const beat = generateBeat(formData);

			expect(beat.measures).toHaveLength(3);
			expect(beat.beatsPerMeasure).toBe(4);
			expect(beat.difficulty).toBe('I’m Too Young to Drum');
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
				difficulty: 'I’m Too Young to Drum',
			};

			const beat = generateBeat(formData);

			beat.measures.forEach(measure => {
				const totalDuration = measure.reduce((sum, note) => sum + note.dur, 0);
				expect(totalDuration).toBe(32); // 32-step grid
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
					expect(note.start).toBeLessThan(32);
					expect(note.dur).toBeGreaterThan(0);
					expect(note.dur).toBeLessThanOrEqual(32);
					expect(typeof note.isDominant).toBe('boolean');
					expect(['ghost', 'normal', 'accent', 'rimshot']).toContain(note.dynamic);
					expect(['flam', 'drag', null]).toContain(note.ornament);
				});
			});
		});
	});

	describe('generateHandRuns', () => {
		it('applies sticking pattern to notes', () => {
			const measure = [
				{ start: 0, dur: 8, isDominant: true, dynamic: 'normal' as const, ornament: null },
				{ start: 8, dur: 8, isDominant: true, dynamic: 'normal' as const, ornament: null },
				{ start: 16, dur: 8, isDominant: true, dynamic: 'normal' as const, ornament: null },
				{ start: 24, dur: 8, isDominant: true, dynamic: 'normal' as const, ornament: null },
			];

			const result = generateHandRuns(measure, {
				runLengths: { 1: 0.5, 2: 0.5 },
				switchProb: 0.5,
				dynamicScale: [2, 7, 9, 10],
				flamThreshold: 0.1,
				dragThreshold: 0.1,
				allowBalancing: false,
			});

			// Should have some variation in isDominant values
			const dominantCount = result.filter(note => note.isDominant).length;
			expect(dominantCount).toBeGreaterThan(0);
			expect(dominantCount).toBeLessThanOrEqual(result.length);
		});
	});

	describe('addDynamics', () => {
		it('applies dynamics based on scale', () => {
			const measure = [
				{ start: 0, dur: 8, isDominant: true, dynamic: 'normal' as const, ornament: null },
				{ start: 8, dur: 8, isDominant: false, dynamic: 'normal' as const, ornament: null },
			];

			const result = addDynamics(measure, {
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
			const measure = [
				{ start: 0, dur: 8, isDominant: true, dynamic: 'normal' as const, ornament: null },
				{ start: 8, dur: 8, isDominant: false, dynamic: 'normal' as const, ornament: null },
			];

			const result = addOrnaments(measure, {
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
			const measure = [
				{ start: 0, dur: 8, isDominant: true, dynamic: 'normal' as const, ornament: null },
				{ start: 8, dur: 8, isDominant: true, dynamic: 'normal' as const, ornament: null },
				{ start: 16, dur: 8, isDominant: true, dynamic: 'normal' as const, ornament: null },
				{ start: 24, dur: 8, isDominant: true, dynamic: 'normal' as const, ornament: null },
			];

			const result = applyBalancing(measure, {
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
			const measure = [
				{ start: 0, dur: 8, isDominant: true, dynamic: 'normal' as const, ornament: null },
				{ start: 8, dur: 8, isDominant: true, dynamic: 'normal' as const, ornament: null },
				{ start: 16, dur: 8, isDominant: true, dynamic: 'normal' as const, ornament: null },
				{ start: 24, dur: 8, isDominant: true, dynamic: 'normal' as const, ornament: null },
			];

			const result = applyBalancing(measure, {
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
});
