# Types, Lookups, and Constants Documentation

This document provides comprehensive documentation for the type definitions, lookup tables, and constants used throughout the RandoDrum application.

## Overview

RandoDrum uses a comprehensive type system built on TypeScript with runtime validation through Zod schemas. The type system is organized by domain and provides both compile-time type safety and runtime validation.

## Type System Architecture

```
src/types/
├── index.ts             # Central type exports
├── api.ts               # API-related types
├── beat.ts              # Beat generation types
├── color.ts             # Color definitions
├── difficulty.ts        # Difficulty level types
├── duration.ts          # Note duration types
├── dynamic.ts           # Dynamic level types
├── error.ts             # Error handling types
├── form.ts              # Form-related types
├── noteType.ts          # Note type definitions
├── ornament.ts          # Ornament types
├── store.ts             # Store and state types
├── test.ts              # Test-related types
├── ui.ts                # UI-specific types
└── utils.ts             # Utility types
```

## Core Type Definitions

### Beat Generation Types

#### Note Structure

```typescript
export type Note = {
	start: NoteStart; // Start time in grid ticks
	dur: Duration; // Duration in grid ticks
	dynamic: Dynamic; // Dynamic level (ghost, normal, accent, rimshot)
	isDominant: boolean; // Whether played with dominant hand
	ornament: Ornament; // Ornament type (flam, drag, null)
};
```

#### Measure Structure

```typescript
export type Measure = Note[];
```

#### Generated Beat Structure

```typescript
export type GeneratedBeat = {
	measures: Measure[]; // Array of measures
	beatsPerMeasure: number; // Beats per measure (1-16)
	difficulty: DifficultyLevel; // Difficulty level used
};
```

#### Form Data Structure

```typescript
export type BeatFormData = {
	beats: number; // Beats per measure (1-16)
	measures: number; // Number of measures (1-32)
	difficulty: DifficultyLevel; // Selected difficulty level
};
```

### Duration System Types

#### Duration Values

The 96-grid system supports 10 distinct duration values:

```typescript
// Straight durations (power-of-two divisions)
export type StraightDuration = 6 | 12 | 24 | 48 | 96;

// Triplet durations (divide by 3)
export type TripletDuration = 8 | 16;

// Dotted durations (1.5x base duration)
export type DottedDuration = 18 | 36 | 72;

// Combined duration type
export type DurationValue = StraightDuration | DottedDuration | TripletDuration;
```

#### Duration Configuration

```typescript
export type DurationConfig = {
	value: DurationValue; // Grid tick value
	name: NoteTypeName; // Human-readable name
	symbol: string; // Display symbol
};
```

### Dynamic System Types

#### Dynamic Levels

```typescript
export const DYNAMICS = ['ghost', 'normal', 'accent', 'rimshot'] as const;
export type DynamicName = (typeof DYNAMICS)[number];
export type Dynamic = DynamicName;
```

#### Dynamic Configuration

```typescript
export type DynamicConfig = {
	name: DynamicName; // Dynamic level name
	symbol: string; // Display symbol
};

export type DynamicScale = [number, number, number]; // [ghost, normal, accent/rimshot]
```

### Ornament Types

#### Ornament Definitions

```typescript
export const ORNAMENTS = ['flam', 'drag', null] as const;
export type OrnamentName = (typeof ORNAMENTS)[number];
export type Ornament = OrnamentName;
```

#### Ornament Configuration

```typescript
export type OrnamentConfig = {
	name: OrnamentName; // Ornament name
	symbol: string; // Display symbol
};
```

### Difficulty System Types

#### Difficulty Levels

```typescript
export const DIFFICULTY_LEVELS = [
	"I'm Too Young to Drum",
	'Hey, Not Too Rough',
	'Hurt Me Plenty',
	'Ultra-Violence',
	'Drumline!',
] as const;

export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];
```

#### Difficulty Configuration

```typescript
export type DifficultyConfig = {
	durations: DurationWeightConfig[]; // Available durations with weights
	dynamicScale: DynamicScale; // Dynamic level distribution
	flamThreshold: number; // Flam probability (0-1)
	dragThreshold: number; // Drag probability (0-1)
	restProbability: number; // Rest probability (0-1)
	maxClump: number; // Maximum consecutive same-hand notes
	handRatio: [number, number]; // [min, max] dominant hand percentage
	runLengths: RunLengthConfig[]; // Sticking pattern configuration
};
```

### Color System Types

#### Color Definitions

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

#### Dominant Hand

```typescript
export type DominantHand = 'left' | 'right';
```

#### Technique Types

```typescript
export type TechniqueTypeName = 'Accent' | 'Basic' | 'Drag' | 'Flam' | 'Ghost' | 'Rimshot';
```

#### Chart Data

```typescript
export type ChartData = Record<
	DifficultyLevel,
	{
		notes: NoteTypeName[]; // Available note types
		techniques: TechniqueTypeName[]; // Available techniques
		restProbability: number; // Rest probability percentage
	}
>;
```

## Constants and Lookup Tables

### Duration Constants

#### Duration Arrays

```typescript
// Straight note durations (power-of-two divisions)
export const STRAIGHT_DURATIONS = [6, 12, 24, 48, 96] as const;

// Dotted note durations (1.5x base duration)
export const DOTTED_DURATIONS = [18, 36, 72] as const;

// Triplet durations (divide by 3)
export const TRIPLET_DURATIONS = [8, 16] as const;

// Combined duration array
export const DURATIONS: readonly Duration[] = [
	...STRAIGHT_DURATIONS,
	...TRIPLET_DURATIONS,
	...DOTTED_DURATIONS,
] as Duration[];
```

#### Duration Configuration Lookup

```typescript
export const DURATION_CONFIGS: readonly DurationConfig[] = [
	// Straight notes
	{ name: 'Sixteenth', symbol: 's', value: 6 },
	{ name: 'Eighth', symbol: 'e', value: 12 },
	{ name: 'Quarter', symbol: 'q', value: 24 },
	{ name: 'Half', symbol: 'h', value: 48 },
	{ name: 'Whole', symbol: 'w', value: 96 },

	// Dotted notes
	{ name: 'Dotted Eighth', symbol: 'i', value: 18 },
	{ name: 'Dotted Quarter', symbol: 'j', value: 36 },
	{ name: 'Dotted Half', symbol: 'd', value: 72 },

	// Triplets
	{ name: 'Eighth Triplet', symbol: 'T', value: 8 },
	{ name: 'Quarter Triplet', symbol: 't', value: 16 },
] as const;
```

### Dynamic Constants

#### Dynamic Configuration

```typescript
export const DYNAMIC_CONFIGS: readonly DynamicConfig[] = [
	{ name: 'ghost', symbol: 'g' },
	{ name: 'normal', symbol: 'n' },
	{ name: 'accent', symbol: 'a' },
	{ name: 'rimshot', symbol: 'r' },
] as const;
```

### Ornament Constants

#### Ornament Configuration

```typescript
export const ORNAMENT_CONFIGS: readonly OrnamentConfig[] = [
	{ name: 'flam', symbol: 'f' },
	{ name: 'drag', symbol: 'd' },
	{ name: null, symbol: '' },
] as const;
```

### Difficulty Constants

#### Difficulty Configuration Lookup

```typescript
export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
	'I’m Too Young to Drum': {
		durations: [
			{ duration: 24, weight: 0.4 }, // Quarter
			{ duration: 48, weight: 0.3 }, // Half
			{ duration: 72, weight: 0.2 }, // Dotted Half
			{ duration: 96, weight: 0.1 }, // Whole
		],
		dynamicScale: [0, 10, 0], // Only normal
		flamThreshold: 0, // No flams
		dragThreshold: 0, // No drags
		restProbability: 0.1, // 10% rests
		maxClump: 1, // No runs
		handRatio: [45, 55], // Balanced hands
		runLengths: [{ length: 1, weight: 1 }], // Only single notes
	},
	// ... other difficulty configurations
};
```

### UI Constants

#### Technique Types

```typescript
export const TECHNIQUE_TYPES: readonly TechniqueTypeName[] = [
	'Basic',
	'Accent',
	'Flam',
	'Drag',
	'Ghost',
	'Rimshot',
] as const;
```

#### Technique Definitions

```typescript
export const TECHNIQUE_DEFINITIONS: Record<TechniqueTypeName, string> = {
	Basic: 'Standard note with normal volume and timing',
	Accent: 'A note played louder than surrounding notes',
	Flam: 'Two notes played almost simultaneously, with one slightly before the other',
	Drag: 'Two grace notes before a main note',
	Ghost: 'A very quiet note, often played on the snare drum',
	Rimshot: 'A note played by hitting both the drumhead and rim simultaneously',
} as const;
```

#### Note Types

```typescript
export const NOTE_TYPES: readonly NoteType[] = DURATION_DISPLAY_ORDER.map(name => {
	const config = DURATION_CONFIGS.find(c => c.name === name);
	if (!config) throw new Error(`Duration config not found for ${name}`);
	return {
		name: config.name,
		value: config.value,
	};
});
```

### Browser Extension Constants

#### Extension Attributes

```typescript
export const BROWSER_EXTENSION_ATTRIBUTES = [
	'cz-shortcut-listen', // Common password manager extension
	'data-1password-root', // 1Password
	'data-bitwarden-watching', // Bitwarden
	'data-dashlane-id', // Dashlane
	'data-grammarly-ignore', // Grammarly
	'data-grammarly-shadow-root', // Grammarly
	'data-lastpass-icon-root', // LastPass
] as const;
```

## Validation System

### Zod Schemas

The application uses comprehensive Zod schemas for runtime validation:

#### Basic Type Schemas

```typescript
export const difficultyLevelSchema = z.enum(
	DIFFICULTY_LEVELS.map(level => level) as [string, ...string[]]
);

export const durationValueSchema = z.union([...DURATIONS.map(duration => z.literal(duration))]);

export const dynamicNameSchema = z.enum(DYNAMICS.map(dynamic => dynamic) as [string, ...string[]]);

export const ornamentNameSchema = z.union([...ORNAMENTS.map(ornament => z.literal(ornament))]);
```

#### Complex Object Schemas

```typescript
export const noteSchema = z.object({
	start: z.number().min(0),
	dur: durationValueSchema,
	dynamic: dynamicNameSchema,
	isDominant: z.boolean(),
	ornament: ornamentNameSchema,
});

export const beatFormDataSchema = z.object({
	beats: z.number().min(1).max(16).int(),
	measures: z.number().min(1).max(32).int(),
	difficulty: difficultyLevelSchema,
});

export const generatedBeatSchema = z.object({
	measures: z.array(measureSchema),
	beatsPerMeasure: z.number().min(1).max(16).int(),
	difficulty: difficultyLevelSchema,
});
```

### Validation Functions

#### Strict Validation

```typescript
export const validateBeatFormData = (data: unknown): ValidatedBeatFormData => {
	return beatFormDataSchema.parse(data);
};

export const validateGeneratedBeat = (data: unknown): ValidatedGeneratedBeat => {
	return generatedBeatSchema.parse(data);
};
```

#### Safe Validation

```typescript
export const safeValidateBeatFormData = (
	data: unknown
): { success: true; data: ValidatedBeatFormData } | { success: false; error: string } => {
	try {
		const validated = beatFormDataSchema.parse(data);
		return { success: true, data: validated };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: `Invalid beat form data: ${error.errors.map(e => e.message).join(', ')}`,
			};
		}
		return { success: false, error: 'Invalid beat form data format' };
	}
};
```

#### Type Guards

```typescript
export const isBeatFormData = (data: unknown): data is ValidatedBeatFormData => {
	return beatFormDataSchema.safeParse(data).success;
};

export const isGeneratedBeat = (data: unknown): data is ValidatedGeneratedBeat => {
	return generatedBeatSchema.safeParse(data).success;
};
```

## Utility Functions

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

### Beat Validation Utilities

```typescript
export const isValidDynamic = (value: string): value is Dynamic =>
	DYNAMICS.includes(value as Dynamic);

export const isValidDuration = (value: number): value is Duration =>
	DURATIONS.includes(value as Duration);

export const isValidOrnament = (value: string | null): value is Ornament =>
	ORNAMENTS.includes(value as Ornament);
```

### Browser Extension Utilities

```typescript
export const isBrowserExtensionAttribute = (attributeName: string): boolean => {
	return BROWSER_EXTENSION_ATTRIBUTES.some(attr => attributeName.includes(attr));
};
```

## Type Inference

The system provides comprehensive type inference from Zod schemas:

```typescript
// Type inference from schemas
export type ValidatedBeatFormData = z.infer<typeof beatFormDataSchema>;
export type ValidatedGeneratedBeat = z.infer<typeof generatedBeatSchema>;
export type ValidatedMeasure = z.infer<typeof measureSchema>;
export type ValidatedNote = z.infer<typeof noteSchema>;
```

## Best Practices

### Type Safety

- Always use the provided type definitions instead of creating custom types
- Leverage Zod schemas for both runtime validation and type inference
- Use type guards for runtime type checking
- Prefer safe validation functions for user input

### Constants Usage

- Use the provided constants instead of hardcoding values
- Leverage lookup tables for configuration data
- Use readonly arrays and objects for immutable data structures

### Validation

- Use strict validation for internal data processing
- Use safe validation for user input and external data
- Provide meaningful error messages for validation failures
- Use type guards for runtime type checking

## Integration with Application

The type system integrates with:

- **Form System**: TanStack Form with Zod validation
- **State Management**: Zustand stores with typed state
- **API Layer**: tRPC with typed procedures
- **Component System**: React components with typed props
- **Testing**: Comprehensive test type definitions

This type system provides a solid foundation for type-safe development throughout the RandoDrum application, ensuring both compile-time type safety and runtime data validation.
