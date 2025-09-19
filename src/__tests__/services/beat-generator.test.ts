import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateRhythm } from '@/server';
import type { DurationValue, DurationWeightConfig } from '@/types';

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
});
