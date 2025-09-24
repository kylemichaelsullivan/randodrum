/**
 * Unified symbol mapping system for drum notation
 * Eliminates duplication between notes and rests
 */

import type { DurationValue } from './durations';

// Base symbol types
export type NoteSymbol = 's' | 'e' | 'i' | 'q' | 'j' | 'h' | 'd' | 'w' | 'T' | 't';
export type RestSymbol = 'S' | 'E' | 'I' | 'Q' | 'J' | 'H' | 'D' | 'W' | 'T' | 't';

// Generic symbol mapping configuration
export type SymbolMapping<T extends string> = Record<DurationValue, T>;

// Note symbol mappings (lowercase)
export const NOTE_SYMBOL_MAP: SymbolMapping<NoteSymbol> = {
	6: 's', // Sixteenth
	8: 'T', // Eighth Triplet
	12: 'e', // Eighth
	16: 't', // Quarter Triplet
	18: 'i', // Dotted Eighth
	24: 'q', // Quarter
	36: 'j', // Dotted Quarter
	48: 'h', // Half
	72: 'd', // Dotted Half
	96: 'w', // Whole
} as const;

// Rest symbol mappings (uppercase)
export const REST_SYMBOL_MAP: SymbolMapping<RestSymbol> = {
	6: 'S', // Sixteenth
	8: 'T', // Eighth Triplet
	12: 'E', // Eighth
	16: 't', // Quarter Triplet
	18: 'I', // Dotted Eighth
	24: 'Q', // Quarter
	36: 'J', // Dotted Quarter
	48: 'H', // Half
	72: 'D', // Dotted Half
	96: 'W', // Whole
} as const;

// Generic symbol lookup function
export function getSymbol<T extends string>(
	duration: DurationValue,
	symbolMap: SymbolMapping<T>,
	fallback: T
): T {
	return symbolMap[duration] ?? fallback;
}

// Specific lookup functions
export const getNoteSymbol = (duration: DurationValue): NoteSymbol =>
	getSymbol(duration, NOTE_SYMBOL_MAP, 'q');

export const getRestSymbol = (duration: DurationValue): RestSymbol =>
	getSymbol(duration, REST_SYMBOL_MAP, 'Q');
