/**
 * Generic type utilities to eliminate DRY violations
 * Provides common patterns for const arrays and derived types
 */

// Generic const array type pattern
export type ConstArray<T extends readonly unknown[]> = T;
export type ArrayElement<T extends readonly unknown[]> = T[number];

// Generic config type for items with name and symbol
export type NamedConfig<T extends string> = {
	name: T;
	symbol: string;
};

// Generic function to create const array with derived types
export function createConstArray<T extends readonly string[]>(arr: T) {
	return arr;
}

// Generic function to create config array
export function createConfigArray<T extends string>(
	items: readonly T[],
	symbolMap: Record<T, string>
): readonly NamedConfig<T>[] {
	return items.map(name => ({ name, symbol: symbolMap[name] }));
}
