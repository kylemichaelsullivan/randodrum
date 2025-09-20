# Validation System Documentation

This document provides comprehensive documentation for the validation system used throughout the RandoDrum application, including Zod schemas, validation functions, and type safety patterns.

## Overview

RandoDrum implements a unified validation system using Zod that provides both runtime validation and TypeScript type inference. The system ensures data integrity across the entire application, from form inputs to API responses.

## Architecture

```
src/utils/validation.ts
├── Basic Type Schemas          # Individual type validation
├── Complex Object Schemas      # Composite object validation
├── Type Inference Helpers      # TypeScript type derivation
├── Individual Validation       # Single-value validation functions
├── Complex Object Validation   # Multi-field validation functions
├── Safe Validation Functions   # Error-safe validation with results
└── Type Guards                 # Runtime type checking
```

## Core Validation Schemas

### Basic Type Schemas

#### Difficulty Level Schema

```typescript
export const difficultyLevelSchema = z.enum(
	DIFFICULTY_LEVELS.map(level => level) as [string, ...string[]]
);
```

**Purpose**: Validates difficulty level strings against the predefined difficulty levels.

**Valid Values**:

- "I’m Too Young to Drum"
- "Hey, Not Too Rough"
- "Hurt Me Plenty"
- "Ultra-Violence"
- "Drumline!"

#### Duration Value Schema

```typescript
export const durationValueSchema = z.union([...DURATIONS.map(duration => z.literal(duration))] as [
	ZodLiteral<number>,
	ZodLiteral<number>,
	...ZodLiteral<number>[],
]);
```

**Purpose**: Validates duration values against the 96-grid system.

**Valid Values**: `6, 8, 12, 16, 18, 24, 36, 48, 72, 96`

#### Dynamic Name Schema

```typescript
export const dynamicNameSchema = z.enum(DYNAMICS.map(dynamic => dynamic) as [string, ...string[]]);
```

**Purpose**: Validates dynamic level names.

**Valid Values**: `"normal", "accent", "ghost" "rimshot"`

#### Note Type Name Schema

```typescript
export const noteTypeNameSchema = z.enum(
	DURATION_CONFIGS.map(config => config.name).map(name => name) as [string, ...string[]]
);
```

**Purpose**: Validates note type names against duration configurations.

**Valid Values**:

- "Sixteenth", "Eighth", "Quarter", "Half", "Whole"
- "Dotted Eighth", "Dotted Quarter", "Dotted Half"
- "Eighth Triplet", "Quarter Triplet"

#### Ornament Name Schema

```typescript
export const ornamentNameSchema = z.union([...ORNAMENTS.map(ornament => z.literal(ornament))] as [
	ZodLiteral<string | null>,
	ZodLiteral<string | null>,
	...ZodLiteral<string | null>[],
]);
```

**Purpose**: Validates ornament names, including null for no ornament.

**Valid Values**: `"flam", "drag", null`

#### Technique Type Name Schema

```typescript
export const techniqueTypeNameSchema = z.enum(
	TECHNIQUE_TYPES.map(type => type) as [string, ...string[]]
);
```

**Purpose**: Validates technique type names.

**Valid Values**: `"Accent", "Basic", "Drag", "Flam", "Ghost", "Rimshot"`

### Complex Object Schemas

#### Note Schema

```typescript
export const noteSchema = z.object({
	start: z.number().min(0), // Start time must be non-negative
	dur: durationValueSchema, // Duration must be valid grid value
	dynamic: dynamicNameSchema, // Dynamic must be valid level
	isDominant: z.boolean(), // Boolean for hand dominance
	ornament: ornamentNameSchema, // Ornament must be valid or null
});
```

**Purpose**: Validates individual note objects with all required properties.

**Validation Rules**:

- `start`: Non-negative number (grid tick position)
- `dur`: Must be a valid duration value from the 96-grid system
- `dynamic`: Must be a valid dynamic level name
- `isDominant`: Boolean indicating dominant hand usage
- `ornament`: Must be a valid ornament name or null

#### Measure Schema

```typescript
export const measureSchema = z.array(noteSchema);
```

**Purpose**: Validates arrays of notes representing a measure.

**Validation Rules**:

- Must be an array
- Each element must be a valid note object

#### Beat Form Data Schema

```typescript
export const beatFormDataSchema = z.object({
	beats: z.number().min(1).max(16).int(), // 1-16 beats per measure
	measures: z.number().min(1).max(32).int(), // 1-32 measures
	difficulty: difficultyLevelSchema, // Valid difficulty level
});
```

**Purpose**: Validates form data for beat generation.

**Validation Rules**:

- `beats`: Integer between 1 and 16 (inclusive)
- `measures`: Integer between 1 and 32 (inclusive)
- `difficulty`: Must be a valid difficulty level

#### Generated Beat Schema

```typescript
export const generatedBeatSchema = z.object({
	measures: z.array(measureSchema), // Array of valid measures
	beatsPerMeasure: z.number().min(1).max(16).int(), // 1-16 beats per measure
	difficulty: difficultyLevelSchema, // Valid difficulty level
});
```

**Purpose**: Validates generated beat objects from the beat generator.

**Validation Rules**:

- `measures`: Array of valid measure objects
- `beatsPerMeasure`: Integer between 1 and 16 (inclusive)
- `difficulty`: Must be a valid difficulty level

## Type Inference

The validation system provides TypeScript type inference from Zod schemas:

```typescript
// Type inference from schemas
export type ValidatedBeatFormData = z.infer<typeof beatFormDataSchema>;
export type ValidatedGeneratedBeat = z.infer<typeof generatedBeatSchema>;
export type ValidatedMeasure = z.infer<typeof measureSchema>;
export type ValidatedNote = z.infer<typeof noteSchema>;
```

**Benefits**:

- Single source of truth for both runtime validation and compile-time types
- Automatic type updates when schemas change
- Eliminates type drift between validation and TypeScript definitions

## Validation Functions

### Individual Type Validation

#### Strict Validation Functions

```typescript
export const validateDifficultyLevel = (value: unknown): z.infer<typeof difficultyLevelSchema> => {
	return difficultyLevelSchema.parse(value);
};

export const validateDurationValue = (value: unknown): z.infer<typeof durationValueSchema> => {
	return durationValueSchema.parse(value);
};

export const validateDynamicName = (value: unknown): z.infer<typeof dynamicNameSchema> => {
	return dynamicNameSchema.parse(value);
};

export const validateNoteTypeName = (value: unknown): z.infer<typeof noteTypeNameSchema> => {
	return noteTypeNameSchema.parse(value);
};

export const validateOrnamentName = (value: unknown): z.infer<typeof ornamentNameSchema> => {
	return ornamentNameSchema.parse(value);
};

export const validateTechniqueTypeName = (
	value: unknown
): z.infer<typeof techniqueTypeNameSchema> => {
	return techniqueTypeNameSchema.parse(value);
};
```

**Usage**: These functions throw errors on validation failure, suitable for internal data processing where invalid data should cause immediate failure.

#### Complex Object Validation Functions

```typescript
export const validateBeatFormData = (data: unknown): ValidatedBeatFormData => {
	return beatFormDataSchema.parse(data);
};

export const validateGeneratedBeat = (data: unknown): ValidatedGeneratedBeat => {
	return generatedBeatSchema.parse(data);
};

export const validateMeasure = (data: unknown): ValidatedMeasure => {
	return measureSchema.parse(data);
};

export const validateNote = (data: unknown): ValidatedNote => {
	return noteSchema.parse(data);
};
```

**Usage**: These functions validate complex objects and throw errors on failure, suitable for internal data processing.

### Safe Validation Functions

Safe validation functions return result objects instead of throwing errors, making them suitable for user input and external data:

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

export const safeValidateGeneratedBeat = (
	data: unknown
): { success: true; data: ValidatedGeneratedBeat } | { success: false; error: string } => {
	try {
		const validated = generatedBeatSchema.parse(data);
		return { success: true, data: validated };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: `Invalid generated beat data: ${error.errors.map(e => e.message).join(', ')}`,
			};
		}
		return { success: false, error: 'Invalid generated beat data format' };
	}
};
```

**Usage**: These functions are ideal for:

- User input validation
- External API data validation
- Data import/export validation
- Any scenario where graceful error handling is preferred

### Type Guards

Type guards provide runtime type checking without validation:

```typescript
export const isBeatFormData = (data: unknown): data is ValidatedBeatFormData => {
	return beatFormDataSchema.safeParse(data).success;
};

export const isGeneratedBeat = (data: unknown): data is ValidatedGeneratedBeat => {
	return generatedBeatSchema.safeParse(data).success;
};

export const isMeasure = (data: unknown): data is ValidatedMeasure => {
	return measureSchema.safeParse(data).success;
};

export const isNote = (data: unknown): data is ValidatedNote => {
	return noteSchema.safeParse(data).success;
};
```

**Usage**: Type guards are useful for:

- Runtime type checking without throwing errors
- Type narrowing in TypeScript
- Conditional logic based on data types
- Defensive programming patterns

## Integration Patterns

### Form Integration

The validation system integrates with TanStack Form for type-safe form handling:

```typescript
import { useForm } from '@tanstack/react-form';
import { beatFormDataSchema, type ValidatedBeatFormData } from '@/utils/validation';

const form = useForm<ValidatedBeatFormData>({
	defaultValues: {
		beats: 4,
		measures: 4,
		difficulty: 'Hey, Not Too Rough',
	},
	onSubmit: async ({ value }) => {
		// value is automatically typed as ValidatedBeatFormData
		const result = safeValidateBeatFormData(value);
		if (result.success) {
			// Process validated data
		} else {
			// Handle validation error
		}
	},
});
```

### API Integration

The validation system ensures type safety in API responses:

```typescript
import { validateGeneratedBeat } from '@/utils/validation';

export async function generateBeat(
	formData: ValidatedBeatFormData
): Promise<ValidatedGeneratedBeat> {
	const response = await fetch('/api/generate-beat', {
		method: 'POST',
		body: JSON.stringify(formData),
	});

	const data = await response.json();
	return validateGeneratedBeat(data); // Throws if invalid
}
```

### Store Integration

Zustand stores use validated types for state management:

```typescript
import { create } from 'zustand';
import type { ValidatedGeneratedBeat } from '@/utils/validation';

interface BeatStore {
	currentBeat: ValidatedGeneratedBeat | null;
	setCurrentBeat: (beat: ValidatedGeneratedBeat) => void;
}

export const useBeatStore = create<BeatStore>(set => ({
	currentBeat: null,
	setCurrentBeat: beat => set({ currentBeat: beat }),
}));
```

## Error Handling

### Zod Error Structure

Zod errors provide detailed information about validation failures:

```typescript
interface ZodError {
	errors: Array<{
		code: string; // Error code (e.g., 'invalid_type', 'too_small')
		expected: string; // Expected value type
		received: string; // Received value type
		path: (string | number)[]; // Path to the invalid field
		message: string; // Human-readable error message
	}>;
}
```

### Error Message Generation

The validation system provides comprehensive error messages:

```typescript
// Example error message generation
const result = safeValidateBeatFormData(invalidData);
if (!result.success) {
	console.log(result.error);
	// Output: "Invalid beat form data: Expected number, received string at 'beats'; Expected 1-16, received 0 at 'beats'"
}
```

## Best Practices

### Schema Design

1. **Start with Schemas**: Define Zod schemas first, then derive TypeScript types
2. **Comprehensive Validation**: Include all necessary validation rules in schemas
3. **Meaningful Error Messages**: Use custom error messages for better user experience
4. **Consistent Naming**: Use consistent naming patterns across schemas

### Validation Strategy

1. **Use Strict Validation for Internal Data**: Use functions that throw errors for internal data processing
2. **Use Safe Validation for User Input**: Use safe validation functions for user input and external data
3. **Use Type Guards for Conditional Logic**: Use type guards for runtime type checking
4. **Validate at Boundaries**: Validate data at system boundaries (API, forms, imports)

### Error Handling

1. **Provide Context**: Include context in error messages
2. **Handle Gracefully**: Use safe validation for user-facing operations
3. **Log Errors**: Log validation errors for debugging
4. **User-Friendly Messages**: Convert technical errors to user-friendly messages

## Testing

### Schema Testing

```typescript
import { describe, it, expect } from 'vitest';
import { beatFormDataSchema } from '@/utils/validation';

describe('beatFormDataSchema', () => {
	it('validates correct form data', () => {
		const validData = { beats: 4, measures: 4, difficulty: 'Hey, Not Too Rough' };
		expect(() => beatFormDataSchema.parse(validData)).not.toThrow();
	});

	it('rejects invalid form data', () => {
		const invalidData = { beats: 0, measures: 4, difficulty: 'Hey, Not Too Rough' };
		expect(() => beatFormDataSchema.parse(invalidData)).toThrow();
	});

	it('provides meaningful error messages', () => {
		const invalidData = { beats: 'invalid', measures: 4, difficulty: 'Hey, Not Too Rough' };
		expect(() => beatFormDataSchema.parse(invalidData)).toThrow(/Expected number, received string/);
	});
});
```

### Validation Function Testing

```typescript
import { describe, it, expect } from 'vitest';
import { safeValidateBeatFormData } from '@/utils/validation';

describe('safeValidateBeatFormData', () => {
	it('returns success for valid data', () => {
		const validData = { beats: 4, measures: 4, difficulty: 'Hey, Not Too Rough' };
		const result = safeValidateBeatFormData(validData);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toEqual(validData);
		}
	});

	it('returns error for invalid data', () => {
		const invalidData = { beats: 0, measures: 4, difficulty: 'Hey, Not Too Rough' };
		const result = safeValidateBeatFormData(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error).toContain('Invalid beat form data');
		}
	});
});
```

## Performance Considerations

### Schema Compilation

- Zod schemas are compiled once and reused
- Complex schemas may have higher compilation overhead
- Consider schema complexity vs. validation performance

### Validation Frequency

- Validate at system boundaries, not on every operation
- Use type guards for frequent type checking
- Cache validation results when appropriate

### Error Handling Overhead

- Safe validation has minimal overhead compared to strict validation
- Error message generation adds some overhead
- Consider error handling strategy based on performance requirements

## Future Enhancements

### Custom Validators

```typescript
// Example: Custom validator for beat generation constraints
const beatGenerationValidator = z
	.object({
		beats: z.number().min(1).max(16).int(),
		measures: z.number().min(1).max(32).int(),
		difficulty: difficultyLevelSchema,
	})
	.refine(
		data => data.beats * data.measures <= 128, // Max total notes
		{
			message: 'Total notes (beats × measures) cannot exceed 128',
			path: ['beats', 'measures'],
		}
	);
```

### Async Validation

```typescript
// Example: Async validation for external data
const asyncBeatValidator = z
	.object({
		// ... schema definition
	})
	.refineAsync(
		async data => {
			// Check if beat is too complex for current system
			const complexity = await calculateBeatComplexity(data);
			return complexity < MAX_COMPLEXITY;
		},
		{
			message: 'Beat is too complex for current system',
		}
	);
```

The validation system provides a robust foundation for data integrity throughout the RandoDrum application, ensuring both type safety and runtime validation with comprehensive error handling and user-friendly error messages.
