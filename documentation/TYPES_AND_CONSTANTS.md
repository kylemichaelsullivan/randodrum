# Types and Constants Documentation

This document provides documentation for the type definitions, lookup tables, and constants used throughout the RandoDrum application.

## Type System Overview

RandoDrum uses a simple, consistent type system built on TypeScript with runtime validation through Zod schemas. The type system is organized by domain and provides both compile-time type safety and runtime validation.

## File Organization

```
src/types/
├── index.ts             # Central type exports
├── type-utils.ts        # Generic utilities (createConfigArray, NamedConfig)
├── api.ts               # API-related types
├── beat.ts              # Beat generation types
├── color.ts             # Color definitions
├── difficulty.ts        # Difficulty level types
├── duration.ts          # Note duration types
├── dynamic.ts           # Dynamic level types
├── error.ts             # Error handling types
├── form.ts              # Form-related types
├── ornament.ts          # Ornament types
├── symbol.ts            # Symbol system for notation
├── store.ts             # Store and state types
├── test.ts              # Test-related types
├── ui.ts                # UI-specific types
└── utils.ts             # Utility types
```

## Standard Patterns

### Basic Type Definition Pattern

Most types follow this simple pattern:

```typescript
// 1. Define constant array
export const ITEMS = ['value1', 'value2', 'value3'] as const;

// 2. Derive type from array
export type ItemName = (typeof ITEMS)[number];

// 3. Optional: Create mapping
export const ITEM_MAP: Record<ItemName, string> = {
	value1: 'mapped1',
	value2: 'mapped2',
	value3: 'mapped3',
} as const;
```

### Configuration Array Pattern

For name-value mappings, use `createConfigArray`:

```typescript
import { createConfigArray } from './type-utils';
import type { NamedConfig } from './type-utils';

// Define mapping
export const ITEM_VALUE_MAP: Record<ItemName, number> = {
	value1: 1,
	value2: 2,
	value3: 3,
} as const;

// Create config array
export const ITEM_CONFIGS = createConfigArray(ITEMS, ITEM_VALUE_MAP);

// Type for config items
export type ItemConfig = NamedConfig<ItemName, number>;
```

## Core Type Definitions

### Beat Generation Types

```typescript
export type Note = {
	dur: Duration;
	start: number;
	isRest: boolean;
	dynamic?: DynamicName; // Not needed for rests
	isDominant?: boolean; // Not needed for rests
	ornament?: OrnamentName; // Not needed for rests
};

export type Measure = Note[];
export type GeneratedBeat = {
	beatsPerMeasure: number;
	difficulty: DifficultyLevel;
	measures: Measure[];
};

export type BeatFormData = {
	beats: number;
	difficulty: DifficultyLevel;
	measures: number;
};
```

### Duration System

The 96-grid system supports 10 distinct duration values:

```typescript
// Duration arrays
export const STRAIGHT_DURATIONS = [6, 12, 24, 48, 96] as const;
export const DOTTED_DURATIONS = [18, 36, 72] as const;
export const TRIPLET_DURATIONS = [8, 16] as const;

// Combined durations array (used for validation)
export const DURATIONS: readonly Duration[] = [
	...STRAIGHT_DURATIONS,
	...TRIPLET_DURATIONS,
	...DOTTED_DURATIONS,
] as Duration[];

// Combined type
export type DurationValue = StraightDuration | DottedDuration | TripletDuration;
export type Duration = DurationValue;

// Name mapping
export const DURATION_NAMES = [
	'Whole',
	'Dotted Half',
	'Half',
	'Dotted Quarter',
	'Quarter',
	'Dotted Eighth',
	'Eighth',
	'Sixteenth',
	'Quarter Triplet',
	'Eighth Triplet',
] as const;

export type DurationName = (typeof DURATION_NAMES)[number];

// Configuration
export const DURATION_NAME_TO_VALUE_MAP: Record<DurationName, DurationValue> = {
	Sixteenth: 6,
	'Eighth Triplet': 8,
	Eighth: 12,
	'Quarter Triplet': 16,
	'Dotted Eighth': 18,
	Quarter: 24,
	'Dotted Quarter': 36,
	Half: 48,
	'Dotted Half': 72,
	Whole: 96,
} as const;

// Reverse mapping for lookup
export const DURATION_TO_NAME_MAP = new Map<DurationValue, DurationName>(
	Object.entries(DURATION_NAME_TO_VALUE_MAP).map(([name, value]) => [value, name as DurationName])
);
```

### Dynamic System

```typescript
export const DYNAMICS = ['Normal', 'Accent', 'Rimshot'] as const;
export type DynamicName = (typeof DYNAMICS)[number];

// Threshold types for dynamic note selection
// Values are on a 0-1 scale where:
// - accentThreshold: values below this result in normal dynamics
// - rimshotThreshold: values between accentThreshold and rimshotThreshold result in accent dynamics
// - values at or above rimshotThreshold result in rimshot dynamics
// Constraint: accentThreshold must be <= rimshotThreshold for logical consistency
//
// Implementation: DynamicThresholds is a tuple [accentThreshold, rimshotThreshold]
// This allows for concise configuration while maintaining type safety

export type DynamicThresholds = [accentThreshold: number, rimshotThreshold: number];
```

### Ornament Types

```typescript
export const TECHNIQUE_TYPES = ['Flam', 'Drag'] as const;
export type TechniqueTypeName = (typeof TECHNIQUE_TYPES)[number];

export const ORNAMENTS = [...TECHNIQUE_TYPES, null] as const;
export type OrnamentName = (typeof ORNAMENTS)[number];
```

### Difficulty System

```typescript
export const DIFFICULTY_LEVELS = [
	'I’m Too Young to Drum',
	'Hey, Not Too Ruff',
	'Hurt Me Plenty',
	'Ultra-Violence',
	'Drumline!',
] as const;

export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export type DifficultyConfig = {
	durations: DurationWeightConfig[];
	restProbability: number;
	runLengths: Record<number, number>;
	switchProb: number;
	dynamicThresholds: DynamicThresholds;
	flamThreshold: number;
	dragThreshold: number;
	allowBalancing: boolean;
	maxClump?: number;
	minRatio?: number;
	maxRatio?: number;
};
```

### Difficulty Configuration Examples

Here are the actual configurations used in the application:

```typescript
// I’m Too Young to Drum
{
	durations: [
		{ duration: 24, weight: 0.6 }, // Quarter
		{ duration: 48, weight: 0.25 }, // Half
		{ duration: 72 }, // Dotted Half
		{ duration: 96 }, // Whole
	],
	restProbability: 0.3,
	runLengths: { 1: 1.0 },
	switchProb: 1.0,
	dynamicThresholds: [1.0, 1.0], // Only normal dynamics
	flamThreshold: 0,
	dragThreshold: 0,
	allowBalancing: true,
	maxClump: 1,
	minRatio: 0.45,
	maxRatio: 0.55,
}

// Hurt Me Plenty
{
	durations: [
		{ duration: 6, weight: 0.2 }, // Sixteenth
		{ duration: 8, weight: 0.05 }, // Eighth Triplet
		{ duration: 12, weight: 0.25 }, // Eighth
		{ duration: 18, weight: 0.1 }, // Dotted Eighth
		{ duration: 24, weight: 0.3 }, // Quarter
		{ duration: 36, weight: 0.1 }, // Dotted Quarter
	],
	restProbability: 0.2,
	runLengths: { 1: 0.5, 2: 0.3, 3: 0.2 },
	switchProb: 0.6,
	dynamicThresholds: [0.6, 0.9], // 60% normal, 30% accent, 10% rimshot
	flamThreshold: 0.1,
	dragThreshold: 0.1,
	allowBalancing: true,
	maxClump: 3,
	minRatio: 0.4,
	maxRatio: 0.6,
}
```

### Color System

```typescript
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
```

### UI Types

```typescript
export const DOMINANT_HANDS = ['left', 'right'] as const;
export type DominantHand = (typeof DOMINANT_HANDS)[number];

export type ChartData = Record<
	DifficultyLevel,
	{
		notes: DurationName[];
		dynamics: DynamicName[];
		techniques: TechniqueTypeName[];
		restProbability: number;
	}
>;
```

### Symbol System

```typescript
export const NOTE_SYMBOLS = ['s', 'e', 'i', 'q', 'j', 'h', 'd', 'w', 'T', 't'] as const;
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

// Utility functions for symbol lookup
export function getSymbol<T extends string>(
	duration: DurationValue,
	symbolMap: SymbolMapping<T>,
	fallback: T
): T;

export const getNoteSymbol = (duration: DurationValue): NoteSymbol =>
	getSymbol(duration, NOTE_SYMBOL_MAP, 'q');

export const getRestSymbol = (duration: DurationValue): RestSymbol =>
	getSymbol(duration, REST_SYMBOL_MAP, 'Q');
```

### Error System

export type Result<T> =
| { success: true; data: T; error?: never }
| { success: false; error: AppError; data?: never };

````

## Utility Functions

### Type Utilities

```typescript
// Generic config type
export type NamedConfig<T, V = string> = {
	name: T;
	value: V;
};

// Create config array from mapping
export function createConfigArray<T extends string | number | symbol, V>(
	items: readonly T[],
	valueMap: Record<T, V>
): readonly NamedConfig<T, V>[] {
	return items.map(name => ({ name, value: valueMap[name] }));
}
````

### Duration Utilities

```typescript
export const isTripletDuration = (duration: DurationValue): duration is TripletDuration => {
	return [8, 16].includes(duration);
};

export const isDottedDuration = (duration: DurationValue): duration is DottedDuration => {
	return [18, 36, 72].includes(duration);
};

export const isStraightDuration = (duration: DurationValue): duration is StraightDuration => {
	return [6, 12, 24, 48, 96].includes(duration);
};
```

## Validation System

The application uses Zod schemas for runtime validation:

```typescript
// Basic schemas
export const difficultyLevelSchema = createEnumSchema(DIFFICULTY_LEVELS);
export const durationValueSchema = z.union([...DURATIONS.map(duration => z.literal(duration))] as [
	ZodLiteral<number>,
	ZodLiteral<number>,
	...ZodLiteral<number>[],
]);
export const dynamicNameSchema = createEnumSchema(DYNAMICS);

// Complex schemas
export const noteSchema = z.object({
	dur: durationValueSchema,
	isRest: z.boolean(),
	start: z.number().min(0),
	dynamic: dynamicNameSchema.optional(),
	isDominant: z.boolean().optional(),
	ornament: ornamentNameSchema.optional(),
});

// Type inference
export type ValidatedNote = z.infer<typeof noteSchema>;
```

## Implementation Patterns

### Dynamic Thresholds Usage

The `DynamicThresholds` tuple is used throughout the codebase:

```typescript
// In difficulty configurations
dynamicThresholds: [0.6, 0.9], // [accentThreshold, rimshotThreshold]
	// In beat generation
	function selectDynamic(randomValue: number, dynamicThresholds: DynamicThresholds): DynamicName {
		const [accentThreshold, rimshotThreshold] = dynamicThresholds;
		return (
			randomValue >= rimshotThreshold ? 'Rimshot'
			: randomValue >= accentThreshold ? 'Accent'
			: 'Normal'
		);
	};

// In UI utilities
function getAvailableDynamics(config: DifficultyConfig): DynamicName[] {
	const dynamics: DynamicName[] = ['Normal'];
	const [accentThreshold, rimshotThreshold] = config.dynamicThresholds;

	if (accentThreshold < 1.0) {
		dynamics.push('Accent');
	}

	if (rimshotThreshold < 1.0) {
		dynamics.push('Rimshot');
	}

	return dynamics;
}
```

### Duration Weight Configuration

Duration configurations use a flexible weight system:

```typescript
// With explicit weights
{ duration: 24, weight: 0.6 } // 60% probability

// Without weights (equal probability among unweighted durations)
{ duration: 72 } // Equal share of remaining probability
```

### Symbol System Integration

The symbol system provides unified access to notation symbols:

```typescript
// Get symbols for display
const noteSymbol = getNoteSymbol(24); // 'q' for quarter note
const restSymbol = getRestSymbol(24); // 'Q' for quarter rest

// Direct mapping access
const symbol = NOTE_SYMBOL_MAP[24]; // 'q'
```

## Best Practices

1. **Use `as const`** on all constant arrays and mappings
2. **Derive types** from constants using `typeof`
3. **Use `createConfigArray`** for name-value mappings
4. **Keep it simple** - most types are just const arrays with derived types
5. **Use Zod schemas** for runtime validation when needed
6. **Destructure tuples** when working with `DynamicThresholds`
7. **Use utility functions** for symbol lookup rather than direct mapping access

## Integration

The type system integrates with:

- **Form System**: TanStack Form with Zod validation
- **State Management**: Zustand stores with typed state
- **API Layer**: tRPC with typed procedures
- **Component System**: React components with typed props
- **Testing**: Comprehensive test type definitions
