import { describe, it, expect } from 'vitest';
import { act } from '@testing-library/react';
import { createBeatStoreTestSuite, mockGeneratedBeat, mockUltraViolenceBeat } from '@/__tests__';
import { useBeatStore } from '@/stores';

const beatStoreTestSuite = createBeatStoreTestSuite('BeatStore', useBeatStore);

describe('BeatStore', () => {
	beatStoreTestSuite.withStoreReset(() => {
		it('initializes with null currentBeat', () => {
			beatStoreTestSuite.testInitialValues({
				currentBeat: null,
			});
		});

		it('sets current beat correctly', () => {
			const { result } = beatStoreTestSuite.renderStore();

			act(() => {
				result.current.setCurrentBeat(mockGeneratedBeat);
			});

			expect(result.current.currentBeat).toEqual(mockGeneratedBeat);
		});

		it('updates current beat when setting a new one', () => {
			const { result } = beatStoreTestSuite.renderStore();

			act(() => {
				result.current.setCurrentBeat(mockGeneratedBeat);
			});

			expect(result.current.currentBeat).toEqual(mockGeneratedBeat);

			act(() => {
				result.current.setCurrentBeat(mockUltraViolenceBeat);
			});

			expect(result.current.currentBeat).toEqual(mockUltraViolenceBeat);
			expect(result.current.currentBeat).not.toEqual(mockGeneratedBeat);
		});

		it('clears current beat', () => {
			const { result } = beatStoreTestSuite.renderStore();

			// First set a beat
			act(() => {
				result.current.setCurrentBeat(mockGeneratedBeat);
			});

			expect(result.current.currentBeat).toEqual(mockGeneratedBeat);

			// Then clear it
			act(() => {
				result.current.clearBeat();
			});

			expect(result.current.currentBeat).toBeNull();
		});

		it('maintains beat data integrity', () => {
			const { result } = beatStoreTestSuite.renderStore();

			act(() => {
				result.current.setCurrentBeat(mockGeneratedBeat);
			});

			const storedBeat = result.current.currentBeat;
			expect(storedBeat).not.toBeNull();
			expect(storedBeat?.measures).toHaveLength(4);
			expect(storedBeat?.beatsPerMeasure).toBe(4);
			expect(storedBeat?.difficulty).toBe('I’m Too Young to Drum');
		});

		it('handles complex beat data', () => {
			const { result } = beatStoreTestSuite.renderStore();

			act(() => {
				result.current.setCurrentBeat(mockUltraViolenceBeat);
			});

			const storedBeat = result.current.currentBeat;
			expect(storedBeat).not.toBeNull();
			expect(storedBeat?.difficulty).toBe('Ultra-Violence');
			expect(storedBeat?.measures).toHaveLength(4);

			// Check that measures contain notes with ornaments
			const firstMeasure = storedBeat?.measures[0];
			expect(firstMeasure).toBeDefined();
			expect(firstMeasure?.some(note => note.ornament === 'Flam')).toBe(true);
		});
	});
});
