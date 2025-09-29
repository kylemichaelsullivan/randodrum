/**
 * Generic type utilities to eliminate DRY violations
 * Provides common patterns for const arrays and derived types
 */

// Generic config type for items with name and any value
export type NamedConfig<T, V = string> = {
	name: T;
	value: V;
};

// Generic function to create config array with any value type
export function createConfigArray<T extends string | number | symbol, V>(
	items: readonly T[],
	valueMap: Record<T, V>
): readonly NamedConfig<T, V>[] {
	return items.map(name => ({ name, value: valueMap[name] }));
}
