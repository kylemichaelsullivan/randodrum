/**
 * Optimized symbol lookup maps for O(1) performance
 * These replace expensive array.find() operations with Map lookups
 */

import { DURATION_CONFIGS, DYNAMIC_CONFIGS, ORNAMENT_CONFIGS } from './constants';
import type { Duration, Dynamic, Ornament } from '@/types';

// Create lookup maps once at module load time for maximum performance
export const DURATION_SYMBOL_MAP = new Map<Duration, string>(
	DURATION_CONFIGS.map(config => [config.value, config.symbol])
);

export const DYNAMIC_SYMBOL_MAP = new Map<Dynamic, string>(
	DYNAMIC_CONFIGS.map(config => [config.name, config.symbol])
);

export const ORNAMENT_SYMBOL_MAP = new Map<Ornament, string>(
	ORNAMENT_CONFIGS.map(config => [config.name, config.symbol])
);

// Optimized lookup functions
export const getDurationSymbol = (duration: Duration): string => {
	return DURATION_SYMBOL_MAP.get(duration) ?? '●';
};

export const getDynamicSymbol = (dynamic: Dynamic): string => {
	return DYNAMIC_SYMBOL_MAP.get(dynamic) ?? '';
};

export const getOrnamentSymbol = (ornament: Ornament): string => {
	return ORNAMENT_SYMBOL_MAP.get(ornament) ?? '';
};

// Reverse lookup maps for when we need to find config by symbol
export const SYMBOL_TO_DURATION_MAP = new Map<string, Duration>(
	DURATION_CONFIGS.map(config => [config.symbol, config.value])
);

export const SYMBOL_TO_DYNAMIC_MAP = new Map<string, Dynamic>(
	DYNAMIC_CONFIGS.map(config => [config.symbol, config.name])
);

export const SYMBOL_TO_ORNAMENT_MAP = new Map<string, Ornament>(
	ORNAMENT_CONFIGS.map(config => [config.symbol, config.name])
);
