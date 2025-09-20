/**
 * Type-safe constants for the application
 */

import type { DurationConfig, DynamicConfig, NoteTypeName } from '@/types';

// Duration display order for UI components
export const DURATION_DISPLAY_ORDER: readonly NoteTypeName[] = [
	'Whole',
	'Dotted Half',
	'Half',
	'Dotted Quarter',
	'Quarter',
	'Dotted Eighth',
	'Eighth',
	'Sixteenth',
	'Eighth Triplet',
	'Quarter Triplet',
] as const;

// Duration constants with symbols and colors for grid system
export const DURATION_CONFIGS: readonly DurationConfig[] = [
	// Straight notes (power-of-two divisions)
	{ name: 'Sixteenth', symbol: 's', value: 6 },
	{ name: 'Eighth', symbol: 'e', value: 12 },
	{ name: 'Dotted Eighth', symbol: 'i', value: 18 },
	{ name: 'Quarter', symbol: 'q', value: 24 },
	{ name: 'Dotted Quarter', symbol: 'j', value: 36 },
	{ name: 'Half', symbol: 'h', value: 48 },
	{ name: 'Dotted Half', symbol: 'd', value: 72 },
	{ name: 'Whole', symbol: 'w', value: 96 },

	// Triplets (divide by 3)
	{ name: 'Eighth Triplet', symbol: 'T', value: 8 },
	{ name: 'Quarter Triplet', symbol: 't', value: 16 },
] as const;

// Dynamic constants with symbols
export const DYNAMIC_CONFIGS: readonly DynamicConfig[] = [
	{ name: 'ghost', symbol: '' },
	{ name: 'normal', symbol: '' },
	{ name: 'accent', symbol: '>' },
	{ name: 'rimshot', symbol: '>' },
] as const;
