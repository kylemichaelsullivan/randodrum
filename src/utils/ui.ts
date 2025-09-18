/**
 * UI-related constants and utilities
 */

import { DURATION_CONFIGS } from './constants';
import type { ChartData, NoteType, NoteTypeName, TechniqueTypeName } from '@/types';

// UI constants
export const CHART_DATA: ChartData = {
	'I’m Too Young to Drum': {
		notes: ['Whole', 'Dotted Half', 'Half', 'Quarter'],
		techniques: ['Basic'],
		restProbability: 30,
	},
	'Hey, Not Too Rough': {
		notes: ['Half', 'Dotted Quarter', 'Quarter', 'Eighth'],
		techniques: ['Basic', 'Accent', 'Flam'],
		restProbability: 25,
	},
	'Hurt Me Plenty': {
		notes: ['Dotted Quarter', 'Quarter', 'Dotted Eighth', 'Eighth', 'Quarter Triplet', 'Sixteenth'],
		techniques: ['Basic', 'Accent', 'Flam', 'Drag'],
		restProbability: 20,
	},
	'Ultra-Violence': {
		notes: [
			'Dotted Quarter',
			'Quarter',
			'Dotted Eighth',
			'Eighth',
			'Quarter Triplet',
			'Sixteenth',
			'Eighth Sixtuplet',
			'Thirty-Second',
		],
		techniques: ['Basic', 'Accent', 'Flam', 'Drag', 'Ghost'],
		restProbability: 15,
	},
	'Drumline!': {
		notes: [
			'Dotted Quarter',
			'Quarter',
			'Dotted Eighth',
			'Eighth',
			'Quarter Triplet',
			'Sixteenth',
			'Eighth Sixtuplet',
			'Thirty-Second',
		],
		techniques: ['Basic', 'Accent', 'Flam', 'Drag', 'Ghost'],
		restProbability: 10,
	},
} as const satisfies ChartData;

export const NOTE_TYPES: readonly NoteType[] = DURATION_CONFIGS.map(config => ({
	name: config.name as NoteTypeName,
	value: config.value,
}));

export const TECHNIQUE_TYPES: readonly TechniqueTypeName[] = [
	'Basic',
	'Accent',
	'Flam',
	'Drag',
	'Ghost',
] as const;
