/**
 * Drum dynamic type definitions
 */

// Dynamic name constants (precise type)
export type DynamicName = 'ghost' | 'normal' | 'accent' | 'rimshot';

// Dynamic type alias
export type Dynamic = DynamicName;

// Dynamic configuration type
export type DynamicConfig = {
	name: DynamicName;
	symbol: string;
};

// Dynamic scale type
export type DynamicScale = [number, number, number];
