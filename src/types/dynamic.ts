/**
 * Drum dynamic type definitions
 */

export const DYNAMICS = ['normal', 'accent', 'rimshot'] as const;

export type DynamicArray = typeof DYNAMICS;
export type DynamicName = DynamicArray[number];

export type Dynamic = DynamicName;

export type DynamicConfig = {
	name: DynamicName;
	symbol: string;
};

export type DynamicScale = [number, number];
