/**
 * Color definitions for consistent UI theming
 */

export const COLORS = [
	'white',
	'red',
	'green',
	'lightBlue',
	'blue',
	'lightGray',
	'gray',
	'black',
] as const;

export type ColorName = (typeof COLORS)[number];
