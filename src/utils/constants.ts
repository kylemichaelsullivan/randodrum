/**
 * Type-safe constants for the application
 */

import type { DurationConfig, DynamicConfig, OrnamentConfig } from '@/types';

// Duration constants with symbols and colors for grid system
export const DURATION_CONFIGS: readonly DurationConfig[] = [
	// Straight notes (power-of-two divisions)
	{ name: 'Whole', symbol: 'w', value: 96 },
	{ name: 'Dotted Half', symbol: 'h.', value: 72 },
	{ name: 'Half', symbol: 'h', value: 48 },
	{ name: 'Dotted Quarter', symbol: 'q.', value: 36 },
	{ name: 'Quarter', symbol: 'q', value: 24 },
	{ name: 'Dotted Eighth', symbol: 'e.', value: 18 },
	{ name: 'Eighth', symbol: 'e', value: 12 },
	{ name: 'Dotted Sixteenth', symbol: 's.', value: 9 },
	{ name: 'Sixteenth', symbol: 's', value: 6 },
	{ name: 'Thirty-Second', symbol: 't', value: 3 },

	// Triplets (divide by 3)
	{ name: 'Quarter Triplet', symbol: 'q', value: 16 },
	{ name: 'Eighth Triplet', symbol: 'e', value: 8 },

	// Sixtuplets (divide by 6)
	{ name: 'Eighth Sixtuplet', symbol: 'e', value: 4 },
	{ name: 'Sixteenth Sixtuplet', symbol: 's', value: 2 },
] as const;

// Dynamic constants with symbols
export const DYNAMIC_CONFIGS: readonly DynamicConfig[] = [
	{ name: 'accent', symbol: '>' },
	{ name: 'ghost', symbol: '()' },
	{ name: 'normal', symbol: '' },
	{ name: 'rimshot', symbol: '^' },
] as const;

// Ornament constants with symbols
export const ORNAMENT_CONFIGS: readonly OrnamentConfig[] = [
	{ name: 'drag', symbol: 'd' },
	{ name: 'flam', symbol: 'f' },
	{ name: null, symbol: '' },
] as const;
