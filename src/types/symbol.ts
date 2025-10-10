/**
 * Unified symbol mapping system for drum notation
 * Eliminates duplication between notes and rests
 */

import type { DurationValue } from './duration';

export const NOTE_SYMBOLS = [
	's',
	'e',
	'n',
	'i',
	'q',
	'j',
	'h',
	'd',
	'w',
	'T',
	't',
	'M',
	'O',
	'š',
	'm',
	'o',
	'Ò', // Triplet: 010
	'¤', // Triplet: 001
	'Ó', // Triplet: 110
	'Ñ', // Triplet: 101
	'Õ', // Triplet: 011
] as const;
export const REST_SYMBOLS = ['S', 'E', 'I', 'Q', 'J', 'H', 'D', 'W', 'T', 't'] as const;

export type NoteSymbol = (typeof NOTE_SYMBOLS)[number];
export type RestSymbol = (typeof REST_SYMBOLS)[number];

export type SymbolMapping<T extends string> = Record<DurationValue, T>;

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
	// Note: 'n' is not in this map - it's created dynamically for beamed eighth note pairs
} as const;

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

export function getSymbol<T extends string>(
	duration: DurationValue,
	symbolMap: SymbolMapping<T>,
	fallback: T
): T {
	return symbolMap[duration] ?? fallback;
}

export const getNoteSymbol = (duration: DurationValue, override?: string): NoteSymbol => {
	if (override && NOTE_SYMBOLS.includes(override as NoteSymbol)) {
		return override as NoteSymbol;
	}
	return getSymbol(duration, NOTE_SYMBOL_MAP, 'q');
};

export const getRestSymbol = (duration: DurationValue): RestSymbol =>
	getSymbol(duration, REST_SYMBOL_MAP, 'Q');
