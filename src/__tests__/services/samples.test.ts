import { describe, it, expect } from 'vitest';
import { samples } from '@/samples';
import type { Samples, Note, Measure } from '@/types';

describe('Samples Data', () => {
	describe('Data Structure', () => {
		it('should have all difficulty levels', () => {
			const expectedLevels = [
				'tooYoung',
				'notTooRough', 
				'hurtMePlenty',
				'ultraViolence',
				'drumline'
			];

			expectedLevels.forEach(level => {
				expect(samples).toHaveProperty(level);
				expect(Array.isArray(samples[level as keyof Samples])).toBe(true);
			});
		});

		it('should have exactly 4 measures for each difficulty', () => {
			Object.values(samples).forEach(exercise => {
				expect(exercise).toHaveLength(4);
			});
		});
	});

	describe('Note Validation', () => {
		const validateNote = (note: Note, measureIndex: number, noteIndex: number) => {
			expect(note).toHaveProperty('start');
			expect(note).toHaveProperty('dur');
			expect(note).toHaveProperty('isDominant');
			expect(note).toHaveProperty('dynamic');
			expect(note).toHaveProperty('ornament');

			expect(typeof note.start).toBe('number');
			expect(typeof note.dur).toBe('number');
			expect(typeof note.isDominant).toBe('boolean');
			expect(typeof note.dynamic).toBe('string');
			expect(['ghost', 'normal', 'accent', 'rimshot']).toContain(note.dynamic);
			expect(['flam', 'drag', null]).toContain(note.ornament);

			expect(note.start).toBeGreaterThanOrEqual(0);
			expect(note.start).toBeLessThan(32);
			expect(note.dur).toBeGreaterThan(0);
			expect(note.dur).toBeLessThanOrEqual(32);
		};

		it('should have valid note structure for all notes', () => {
			Object.entries(samples).forEach(([level, exercise]) => {
				exercise.forEach((measure, measureIndex) => {
					measure.forEach((note, noteIndex) => {
						validateNote(note, measureIndex, noteIndex);
					});
				});
			});
		});

		it('should have notes that tile properly within 32-step grid', () => {
			Object.entries(samples).forEach(([level, exercise]) => {
				exercise.forEach((measure, measureIndex) => {
					const totalDuration = measure.reduce((sum, note) => sum + note.dur, 0);
					expect(totalDuration).toBe(32);
				});
			});
		});

		it('should have notes that do not overlap', () => {
			Object.entries(samples).forEach(([level, exercise]) => {
				exercise.forEach((measure, measureIndex) => {
					const sortedNotes = [...measure].sort((a, b) => a.start - b.start);
					
					for (let i = 0; i < sortedNotes.length - 1; i++) {
						const current = sortedNotes[i];
						const next = sortedNotes[i + 1];
						expect(current.start + current.dur).toBeLessThanOrEqual(next.start);
					}
				});
			});
		});
	});

	describe('Difficulty Progression', () => {
		it('should show increasing complexity from tooYoung to drumline', () => {
			const levels = ['tooYoung', 'notTooRough', 'hurtMePlenty', 'ultraViolence', 'drumline'];
			
			for (let i = 0; i < levels.length - 1; i++) {
				const currentLevel = samples[levels[i] as keyof Samples];
				const nextLevel = samples[levels[i + 1] as keyof Samples];
				
				const currentAvgNotes = currentLevel.reduce((sum, measure) => sum + measure.length, 0) / 4;
				const nextAvgNotes = nextLevel.reduce((sum, measure) => sum + measure.length, 0) / 4;
				
				expect(nextAvgNotes).toBeGreaterThanOrEqual(currentAvgNotes);
			}
		});

		it('should have appropriate ornament usage by difficulty', () => {
			// tooYoung should have no ornaments
			const tooYoungNotes = samples.tooYoung.flat();
			tooYoungNotes.forEach(note => {
				expect(note.ornament).toBeNull();
			});

			// notTooRough should have some flams
			const notTooRoughNotes = samples.notTooRough.flat();
			const hasFlams = notTooRoughNotes.some(note => note.ornament === 'flam');
			expect(hasFlams).toBe(true);

			// hurtMePlenty and above should have drags
			const hurtMePlentyNotes = samples.hurtMePlenty.flat();
			const hasDrags = hurtMePlentyNotes.some(note => note.ornament === 'drag');
			expect(hasDrags).toBe(true);
		});

		it('should have appropriate dynamic variety by difficulty', () => {
			// tooYoung should only have normal dynamics
			const tooYoungDynamics = new Set(samples.tooYoung.flat().map(note => note.dynamic));
			expect(tooYoungDynamics.has('normal')).toBe(true);
			expect(tooYoungDynamics.size).toBe(1);

			// Higher levels should have more dynamic variety
			const drumlineDynamics = new Set(samples.drumline.flat().map(note => note.dynamic));
			expect(drumlineDynamics.size).toBeGreaterThan(2);
			expect(drumlineDynamics.has('rimshot')).toBe(true);
		});
	});

	describe('Specific Difficulty Tests', () => {
		describe('tooYoung (I\'m Too Young to Drum)', () => {
			it('should have simple quarter and half note patterns', () => {
				const measure = samples.tooYoung[0];
				const durations = measure.map(note => note.dur);
				
				// Should have durations of 8 (eighth notes) or 16 (quarter notes) or 32 (half notes)
				durations.forEach(dur => {
					expect([8, 16, 32]).toContain(dur);
				});
			});

			it('should have balanced dominant/non-dominant hands', () => {
				const allNotes = samples.tooYoung.flat();
				const dominantCount = allNotes.filter(note => note.isDominant).length;
				const nonDominantCount = allNotes.filter(note => !note.isDominant).length;
				
				// Should be roughly balanced
				expect(Math.abs(dominantCount - nonDominantCount)).toBeLessThanOrEqual(2);
			});
		});

		describe('notTooRough (Hey, Not Too Rough)', () => {
			it('should introduce eighth note patterns', () => {
				const measure = samples.notTooRough[0];
				const hasEighthNotes = measure.some(note => note.dur === 4);
				expect(hasEighthNotes).toBe(true);
			});

			it('should include flam ornaments', () => {
				const allNotes = samples.notTooRough.flat();
				const hasFlams = allNotes.some(note => note.ornament === 'flam');
				expect(hasFlams).toBe(true);
			});
		});

		describe('hurtMePlenty', () => {
			it('should have sixteenth note patterns', () => {
				const measure = samples.hurtMePlenty[0];
				const hasSixteenthNotes = measure.some(note => note.dur === 2);
				expect(hasSixteenthNotes).toBe(true);
			});

			it('should include drag ornaments', () => {
				const allNotes = samples.hurtMePlenty.flat();
				const hasDrags = allNotes.some(note => note.ornament === 'drag');
				expect(hasDrags).toBe(true);
			});

			it('should have ghost notes', () => {
				const allNotes = samples.hurtMePlenty.flat();
				const hasGhostNotes = allNotes.some(note => note.dynamic === 'ghost');
				expect(hasGhostNotes).toBe(true);
			});
		});

		describe('ultraViolence', () => {
			it('should have thirty-second note patterns', () => {
				const measure = samples.ultraViolence[0];
				const hasThirtySecondNotes = measure.some(note => note.dur === 1);
				expect(hasThirtySecondNotes).toBe(true);
			});

			it('should have rimshot dynamics', () => {
				const allNotes = samples.ultraViolence.flat();
				const hasRimshots = allNotes.some(note => note.dynamic === 'rimshot');
				expect(hasRimshots).toBe(true);
			});
		});

		describe('drumline', () => {
			it('should have maximum complexity with mixed durations', () => {
				const allNotes = samples.drumline.flat();
				const uniqueDurations = new Set(allNotes.map(note => note.dur));
				
				// Should have the most variety in note durations
				expect(uniqueDurations.size).toBeGreaterThan(3);
			});

			it('should have maximum ornament usage', () => {
				const allNotes = samples.drumline.flat();
				const ornamentedNotes = allNotes.filter(note => note.ornament !== null);
				
				// Should have high percentage of ornamented notes
				expect(ornamentedNotes.length / allNotes.length).toBeGreaterThan(0.5);
			});

			it('should have all dynamic types', () => {
				const allNotes = samples.drumline.flat();
				const dynamics = new Set(allNotes.map(note => note.dynamic));
				
				expect(dynamics.has('ghost')).toBe(true);
				expect(dynamics.has('normal')).toBe(true);
				expect(dynamics.has('accent')).toBe(true);
				expect(dynamics.has('rimshot')).toBe(true);
			});
		});
	});

	describe('Musical Coherence', () => {
		it('should maintain consistent hand patterns within measures', () => {
			Object.entries(samples).forEach(([level, exercise]) => {
				exercise.forEach((measure, measureIndex) => {
					// Check that hand alternation makes sense
					const hands = measure.map(note => note.isDominant ? 'R' : 'L');
					
					// Should have some alternation (not all same hand)
					const hasAlternation = hands.some((hand, i) => i > 0 && hand !== hands[i - 1]);
					expect(hasAlternation).toBe(true);
				});
			});
		});

		it('should have appropriate accent placement', () => {
			Object.entries(samples).forEach(([level, exercise]) => {
				exercise.forEach((measure, measureIndex) => {
					const accents = measure.filter(note => note.dynamic === 'accent');
					
					// Accents should be on strong beats (0, 8, 16, 24)
					accents.forEach(accent => {
						expect([0, 8, 16, 24]).toContain(accent.start);
					});
				});
			});
		});
	});
});
