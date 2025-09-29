/**
 * Custom utility types for domain-specific patterns
 */

// Extract the type of array elements
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

// Union to intersection type
export type UnionToIntersection<U> =
	(U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

// Extract keys of a type that have a specific value type
export type KeysOfType<T, U> = {
	[K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// Deep partial type (makes nested objects partial too)
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Deep readonly type (makes nested objects readonly too)
export type DeepReadonly<T> = {
	readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Make specific properties optional
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make specific properties required
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// Branded types for better type safety
export type Brand<T, B> = T & { readonly __brand: B };
