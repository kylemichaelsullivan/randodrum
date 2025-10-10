/**
 * Tests for display utilities
 */

import { describe, it, expect } from 'vitest';
import { createDisplayMeasure } from '@/utils';
import type { Measure } from '@/types';

describe('createDisplayMeasure', () => {
	it('combines two consecutive eighth notes into a beamed pair', () => {
		const measure: Measure = [
			{ start: 0, dur: 12, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
			{ start: 12, dur: 12, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false },
		];

		const result = createDisplayMeasure(measure);

		expect(result).toHaveLength(1);
		expect(result[0]?.type).toBe('beamed');
		if (result[0]?.type === 'beamed') {
			expect(result[0].notes).toHaveLength(2);
			expect(result[0].start).toBe(0);
		}
	});

	it('does not beam eighth notes separated by other notes', () => {
		const measure: Measure = [
			{ start: 0, dur: 12, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
			{ start: 12, dur: 24, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false },
			{ start: 36, dur: 12, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
		];

		const result = createDisplayMeasure(measure);

		expect(result).toHaveLength(3);
		expect(result[0]?.type).toBe('single');
		expect(result[1]?.type).toBe('single');
		expect(result[2]?.type).toBe('single');
	});

	it('does not beam eighth rests', () => {
		const measure: Measure = [
			{ start: 0, dur: 12, isRest: true },
			{ start: 12, dur: 12, isRest: true },
		];

		const result = createDisplayMeasure(measure);

		expect(result).toHaveLength(2);
		expect(result[0]?.type).toBe('single');
		expect(result[1]?.type).toBe('single');
	});

	it('does not beam if one of the notes is a rest', () => {
		const measure: Measure = [
			{ start: 0, dur: 12, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
			{ start: 12, dur: 12, isRest: true },
		];

		const result = createDisplayMeasure(measure);

		expect(result).toHaveLength(2);
		expect(result[0]?.type).toBe('single');
		expect(result[1]?.type).toBe('single');
	});

	it('beams multiple pairs in the same measure', () => {
		const measure: Measure = [
			{ start: 0, dur: 24, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
			{ start: 24, dur: 12, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false },
			{ start: 36, dur: 12, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
			{ start: 48, dur: 12, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false },
			{ start: 60, dur: 12, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
		];

		const result = createDisplayMeasure(measure);

		// Should have: quarter (single), beamed pair, beamed pair = 3 display units
		expect(result).toHaveLength(3);
		expect(result[0]?.type).toBe('single');
		expect(result[1]?.type).toBe('beamed');
		expect(result[2]?.type).toBe('beamed');
	});

	it('handles the case from user: Q-q-e-e-e-e becomes Q-q-n-n', () => {
		// Q = quarter rest, q = quarter note, eeee = four eighth notes (should become nn)
		const measure: Measure = [
			{ start: 0, dur: 24, isRest: true }, // Q
			{ start: 24, dur: 24, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false }, // q
			{ start: 48, dur: 12, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false }, // e (on downbeat)
			{ start: 60, dur: 12, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false }, // e
			{ start: 72, dur: 12, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false }, // e (on downbeat)
			{ start: 84, dur: 12, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false }, // e
		];

		const result = createDisplayMeasure(measure);

		// Should have: Q (single), q (single), n (beamed), n (beamed) = 4 display units
		expect(result).toHaveLength(4);
		expect(result[0]?.type).toBe('single'); // Q
		expect(result[1]?.type).toBe('single'); // q
		expect(result[2]?.type).toBe('beamed'); // n (first pair starting at 48)
		expect(result[3]?.type).toBe('beamed'); // n (second pair starting at 72)
	});

	it('does not beam eighth notes that do not start on a downbeat', () => {
		// Two eighth notes starting at position 12 (not on downbeat)
		const measure: Measure = [
			{ start: 0, dur: 12, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false }, // e
			{ start: 12, dur: 12, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false }, // e (not on downbeat)
			{ start: 24, dur: 12, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false }, // e (not consecutive with prev)
		];

		const result = createDisplayMeasure(measure);

		// First two should be beamed (start at 0, which is downbeat)
		// Third should be single (starts at 24, which is downbeat, but has no consecutive eighth after it)
		expect(result).toHaveLength(2);
		expect(result[0]?.type).toBe('beamed'); // First pair (0-12)
		expect(result[1]?.type).toBe('single'); // Single at 24
	});

	it('beams eighth notes starting at downbeat even after quarter note', () => {
		// q, then two eighth notes starting at downbeat 24
		const measure: Measure = [
			{ start: 0, dur: 24, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false }, // q
			{ start: 24, dur: 12, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false }, // e (on downbeat)
			{ start: 36, dur: 12, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false }, // e (consecutive)
		];

		const result = createDisplayMeasure(measure);

		// Should be: q (single), n (beamed pair 24-36)
		expect(result).toHaveLength(2);
		expect(result[0]?.type).toBe('single'); // q
		expect(result[1]?.type).toBe('beamed'); // e at 24 and 36 beamed together
	});

	it('does not beam eighth notes when first note is off the beat', () => {
		// e at 12 (off-beat), e at 24 (on-beat) - not consecutive in time
		const measure: Measure = [
			{ start: 12, dur: 12, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false }, // e (not on downbeat)
			{ start: 24, dur: 12, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false }, // e (on downbeat, consecutive)
			{ start: 36, dur: 12, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false }, // e (not on downbeat, consecutive)
		];

		const result = createDisplayMeasure(measure);

		// First note at 12 is not on downbeat, so won't beam with 24
		// Note at 24 IS on downbeat and consecutive with 36, so WILL beam
		expect(result).toHaveLength(2);
		expect(result[0]?.type).toBe('single'); // e at 12 (not on downbeat)
		expect(result[1]?.type).toBe('beamed'); // e at 24 and 36 beamed
	});

	it('groups three consecutive eighth triplets starting on downbeat', () => {
		// Three eighth triplets (duration 8) starting at position 0
		const measure: Measure = [
			{ start: 0, dur: 8, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
			{ start: 8, dur: 8, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false },
			{ start: 16, dur: 8, dynamic: 'Accent', isDominant: false, ornament: null, isRest: false },
		];

		const result = createDisplayMeasure(measure);

		expect(result).toHaveLength(1);
		expect(result[0]?.type).toBe('triplet');
		if (result[0]?.type === 'triplet') {
			expect(result[0].notes).toHaveLength(3);
			expect(result[0].symbol).toBe('T'); // Eighth triplet symbol
			expect(result[0].className).toBe('isEighthTriplet');
			expect(result[0].start).toBe(0);
		}
	});

	it('groups three consecutive quarter triplets starting on downbeat', () => {
		// Three quarter triplets (duration 16) starting at position 24
		const measure: Measure = [
			{ start: 0, dur: 24, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false }, // Quarter note first
			{ start: 24, dur: 16, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
			{ start: 40, dur: 16, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false },
			{ start: 56, dur: 16, dynamic: 'Accent', isDominant: false, ornament: null, isRest: false },
		];

		const result = createDisplayMeasure(measure);

		expect(result).toHaveLength(2);
		expect(result[0]?.type).toBe('single'); // Quarter note
		expect(result[1]?.type).toBe('triplet');
		if (result[1]?.type === 'triplet') {
			expect(result[1].notes).toHaveLength(3);
			expect(result[1].symbol).toBe('t'); // Quarter triplet symbol
			expect(result[1].className).toBe('isQuarterTriplet');
			expect(result[1].start).toBe(24);
		}
	});

	it('does not group triplets if they are not consecutive', () => {
		// Two eighth triplets with a gap
		const measure: Measure = [
			{ start: 0, dur: 8, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
			{ start: 8, dur: 8, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false },
			{ start: 24, dur: 8, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false }, // Gap at 16-24
		];

		const result = createDisplayMeasure(measure);

		// Should have 3 separate notes (not grouped)
		expect(result).toHaveLength(3);
		expect(result[0]?.type).toBe('single');
		expect(result[1]?.type).toBe('single');
		expect(result[2]?.type).toBe('single');
	});

	it('does not group triplets if not starting on downbeat', () => {
		// Three eighth triplets starting at position 12 (not on downbeat)
		const measure: Measure = [
			{ start: 12, dur: 8, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
			{ start: 20, dur: 8, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false },
			{ start: 28, dur: 8, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false },
		];

		const result = createDisplayMeasure(measure);

		// Should have 3 separate notes (not grouped because not on downbeat)
		expect(result).toHaveLength(3);
		expect(result[0]?.type).toBe('single');
		expect(result[1]?.type).toBe('single');
		expect(result[2]?.type).toBe('single');
	});

	it('groups triplet followed by beamed pair correctly', () => {
		// Eighth triplet group + two eighth notes
		const measure: Measure = [
			{ start: 0, dur: 8, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
			{ start: 8, dur: 8, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false },
			{ start: 16, dur: 8, dynamic: 'Accent', isDominant: false, ornament: null, isRest: false },
			{ start: 24, dur: 12, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
			{ start: 36, dur: 12, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false },
		];

		const result = createDisplayMeasure(measure);

		// Should have: triplet group + beamed pair = 2 display units
		expect(result).toHaveLength(2);
		expect(result[0]?.type).toBe('triplet');
		expect(result[1]?.type).toBe('beamed');
	});

	it('converts triplet with all rests (---) to quarter rest', () => {
		const measure: Measure = [
			{ start: 0, dur: 8, isRest: true },
			{ start: 8, dur: 8, isRest: true },
			{ start: 16, dur: 8, isRest: true },
		];

		const result = createDisplayMeasure(measure);

		expect(result).toHaveLength(1);
		expect(result[0]?.type).toBe('single');
		if (result[0]?.type === 'single') {
			expect(result[0].note.isRest).toBe(true);
			expect(result[0].note.dur).toBe(24);
		}
	});

	it('converts triplet with note+rest+rest (+--) to quarter note', () => {
		const measure: Measure = [
			{ start: 0, dur: 8, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
			{ start: 8, dur: 8, isRest: true },
			{ start: 16, dur: 8, isRest: true },
		];

		const result = createDisplayMeasure(measure);

		expect(result).toHaveLength(1);
		expect(result[0]?.type).toBe('single');
		if (result[0]?.type === 'single') {
			expect(result[0].note.isRest).toBe(false);
			expect(result[0].note.dur).toBe(24);
		}
	});

	it('groups triplet with rest+note+rest (-+-) as Ò pattern', () => {
		const measure: Measure = [
			{ start: 0, dur: 8, isRest: true },
			{ start: 8, dur: 8, dynamic: 'Accent', isDominant: false, ornament: null, isRest: false },
			{ start: 16, dur: 8, isRest: true },
		];

		const result = createDisplayMeasure(measure);

		expect(result).toHaveLength(1);
		expect(result[0]?.type).toBe('triplet');
		if (result[0]?.type === 'triplet') {
			expect(result[0].symbol).toBe('Ò');
			expect(result[0].notes[0]?.isRest).toBe(true);
			expect(result[0].notes[1]?.isRest).toBe(false);
			expect(result[0].notes[2]?.isRest).toBe(true);
		}
	});

	it('groups triplet with rest+rest+note (--+) as ¤ pattern', () => {
		const measure: Measure = [
			{ start: 0, dur: 8, isRest: true },
			{ start: 8, dur: 8, isRest: true },
			{ start: 16, dur: 8, dynamic: 'Normal', isDominant: true, ornament: 'Flam', isRest: false },
		];

		const result = createDisplayMeasure(measure);

		expect(result).toHaveLength(1);
		expect(result[0]?.type).toBe('triplet');
		if (result[0]?.type === 'triplet') {
			expect(result[0].symbol).toBe('¤');
			expect(result[0].notes[0]?.isRest).toBe(true);
			expect(result[0].notes[1]?.isRest).toBe(true);
			expect(result[0].notes[2]?.isRest).toBe(false);
		}
	});

	it('groups triplet with note+note+rest (++-) as Ó pattern', () => {
		const measure: Measure = [
			{ start: 0, dur: 8, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
			{ start: 8, dur: 8, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false },
			{ start: 16, dur: 8, isRest: true },
		];

		const result = createDisplayMeasure(measure);

		expect(result).toHaveLength(1);
		expect(result[0]?.type).toBe('triplet');
		if (result[0]?.type === 'triplet') {
			expect(result[0].symbol).toBe('Ó');
			expect(result[0].notes[0]?.isRest).toBe(false);
			expect(result[0].notes[1]?.isRest).toBe(false);
			expect(result[0].notes[2]?.isRest).toBe(true);
		}
	});

	it('groups triplet with note+rest+note (+-+) as Ñ pattern', () => {
		const measure: Measure = [
			{ start: 0, dur: 8, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
			{ start: 8, dur: 8, isRest: true },
			{ start: 16, dur: 8, dynamic: 'Accent', isDominant: false, ornament: null, isRest: false },
		];

		const result = createDisplayMeasure(measure);

		expect(result).toHaveLength(1);
		expect(result[0]?.type).toBe('triplet');
		if (result[0]?.type === 'triplet') {
			expect(result[0].symbol).toBe('Ñ');
			expect(result[0].notes[0]?.isRest).toBe(false);
			expect(result[0].notes[1]?.isRest).toBe(true);
			expect(result[0].notes[2]?.isRest).toBe(false);
		}
	});

	it('groups triplet with rest+note+note (-++) as Õ pattern', () => {
		const measure: Measure = [
			{ start: 0, dur: 8, isRest: true },
			{ start: 8, dur: 8, dynamic: 'Normal', isDominant: false, ornament: null, isRest: false },
			{ start: 16, dur: 8, dynamic: 'Normal', isDominant: true, ornament: null, isRest: false },
		];

		const result = createDisplayMeasure(measure);

		expect(result).toHaveLength(1);
		expect(result[0]?.type).toBe('triplet');
		if (result[0]?.type === 'triplet') {
			expect(result[0].symbol).toBe('Õ');
			expect(result[0].notes[0]?.isRest).toBe(true);
			expect(result[0].notes[1]?.isRest).toBe(false);
			expect(result[0].notes[2]?.isRest).toBe(false);
		}
	});
});
