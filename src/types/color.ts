/**
 * Color type definitions for consistent UI theming
 */

// All available background colors from globals.css
export type Color =
	| 'bg-white'
	| 'bg-red'
	| 'bg-green'
	| 'bg-light-blue'
	| 'bg-blue'
	| 'bg-light-gray'
	| 'bg-gray'
	| 'bg-black';

// Semantic color mapping for clean usage
export const COLORS = {
	white: 'bg-white',
	red: 'bg-red',
	green: 'bg-green',
	lightBlue: 'bg-light-blue',
	blue: 'bg-blue',
	lightGray: 'bg-light-gray',
	gray: 'bg-gray',
	black: 'bg-black',
} as const;

// Utility function for cleaner color usage
export const color = (name: keyof typeof COLORS): Color => COLORS[name];
