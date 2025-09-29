/**
 * Unified validation system using Zod
 */

import { z, type ZodLiteral } from 'zod';
import { DIFFICULTY_LEVELS } from '@/types/difficulty';
import { DYNAMICS } from '@/types/dynamic';
import { ORNAMENTS, TECHNIQUE_TYPES } from '@/types/ornament';
import { DURATION_DISPLAY_ORDER, DURATIONS } from '@/types/duration';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function createEnumSchema<T extends readonly string[]>(values: T) {
	return z.enum(values as unknown as [string, ...string[]]);
}

// ============================================================================
// BASIC TYPE SCHEMAS
// ============================================================================

export const difficultyLevelSchema = createEnumSchema(DIFFICULTY_LEVELS);

export const durationValueSchema = z.union([...DURATIONS.map(duration => z.literal(duration))] as [
	ZodLiteral<number>,
	ZodLiteral<number>,
	...ZodLiteral<number>[],
]);

export const dynamicNameSchema = createEnumSchema(DYNAMICS);

export const noteTypeNameSchema = createEnumSchema(DURATION_DISPLAY_ORDER);

export const ornamentNameSchema = z.union(
	ORNAMENTS.map(ornament => z.literal(ornament)) as [
		ZodLiteral<string | null>,
		ZodLiteral<string | null>,
		ZodLiteral<string | null>,
	]
);

export const techniqueTypeNameSchema = createEnumSchema(TECHNIQUE_TYPES);

// ============================================================================
// COMPLEX OBJECT SCHEMAS
// ============================================================================

export const noteSchema = z.object({
	start: z.number().min(0),
	dur: durationValueSchema,
	isRest: z.boolean(),
	dynamic: dynamicNameSchema.optional(),
	isDominant: z.boolean().optional(),
	ornament: ornamentNameSchema.optional(),
});

export const measureSchema = z.array(noteSchema);

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

// ============================================================================
// TYPE INFERENCE HELPERS
// ============================================================================

export type ValidatedBeatFormData = z.infer<typeof beatFormDataSchema>;
export type ValidatedGeneratedBeat = z.infer<typeof generatedBeatSchema>;
export type ValidatedMeasure = z.infer<typeof measureSchema>;
export type ValidatedNote = z.infer<typeof noteSchema>;

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export type SafeValidationResult<T> =
	| { success: true; data: T }
	| { success: false; error: string };

// Individual type safe validation functions
export const validateDifficultyLevel = (
	value: unknown
): SafeValidationResult<z.infer<typeof difficultyLevelSchema>> => {
	try {
		const validated = difficultyLevelSchema.parse(value);
		return { success: true, data: validated };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: `Invalid difficulty level: ${error.errors.map(e => e.message).join(', ')}`,
			};
		}
		return { success: false, error: 'Invalid difficulty level format' };
	}
};

export const validateDurationValue = (
	value: unknown
): SafeValidationResult<z.infer<typeof durationValueSchema>> => {
	try {
		const validated = durationValueSchema.parse(value);
		return { success: true, data: validated };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: `Invalid duration value: ${error.errors.map(e => e.message).join(', ')}`,
			};
		}
		return { success: false, error: 'Invalid duration value format' };
	}
};

export const validateDynamicName = (
	value: unknown
): SafeValidationResult<z.infer<typeof dynamicNameSchema>> => {
	try {
		const validated = dynamicNameSchema.parse(value);
		return { success: true, data: validated };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: `Invalid dynamic name: ${error.errors.map(e => e.message).join(', ')}`,
			};
		}
		return { success: false, error: 'Invalid dynamic name format' };
	}
};

export const validateOrnamentName = (
	value: unknown
): SafeValidationResult<z.infer<typeof ornamentNameSchema>> => {
	try {
		const validated = ornamentNameSchema.parse(value);
		return { success: true, data: validated };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: `Invalid ornament name: ${error.errors.map(e => e.message).join(', ')}`,
			};
		}
		return { success: false, error: 'Invalid ornament name format' };
	}
};

// Complex object safe validation functions
export const validateNote = (data: unknown): SafeValidationResult<ValidatedNote> => {
	try {
		const validated = noteSchema.parse(data);
		return { success: true, data: validated };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: `Invalid note data: ${error.errors.map(e => e.message).join(', ')}`,
			};
		}
		return { success: false, error: 'Invalid note data format' };
	}
};

export const validateMeasure = (data: unknown): SafeValidationResult<ValidatedMeasure> => {
	try {
		const validated = measureSchema.parse(data);
		return { success: true, data: validated };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: `Invalid measure data: ${error.errors.map(e => e.message).join(', ')}`,
			};
		}
		return { success: false, error: 'Invalid measure data format' };
	}
};

export const validateBeatFormData = (
	data: unknown
): SafeValidationResult<ValidatedBeatFormData> => {
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

export const validateGeneratedBeat = (
	data: unknown
): SafeValidationResult<ValidatedGeneratedBeat> => {
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

// ============================================================================
// TYPE GUARDS
// ============================================================================

export const isDifficultyLevel = (
	value: unknown
): value is z.infer<typeof difficultyLevelSchema> => {
	return difficultyLevelSchema.safeParse(value).success;
};

export const isDurationValue = (value: unknown): value is z.infer<typeof durationValueSchema> => {
	return durationValueSchema.safeParse(value).success;
};

export const isDynamicName = (value: unknown): value is z.infer<typeof dynamicNameSchema> => {
	return dynamicNameSchema.safeParse(value).success;
};

export const isNoteTypeName = (value: unknown): value is z.infer<typeof noteTypeNameSchema> => {
	return noteTypeNameSchema.safeParse(value).success;
};

export const isOrnamentName = (value: unknown): value is z.infer<typeof ornamentNameSchema> => {
	return ornamentNameSchema.safeParse(value).success;
};

export const isTechniqueTypeName = (
	value: unknown
): value is z.infer<typeof techniqueTypeNameSchema> => {
	return techniqueTypeNameSchema.safeParse(value).success;
};

export const isNote = (data: unknown): data is ValidatedNote => {
	return noteSchema.safeParse(data).success;
};

export const isMeasure = (data: unknown): data is ValidatedMeasure => {
	return measureSchema.safeParse(data).success;
};

export const isBeatFormData = (data: unknown): data is ValidatedBeatFormData => {
	return beatFormDataSchema.safeParse(data).success;
};

export const isGeneratedBeat = (data: unknown): data is ValidatedGeneratedBeat => {
	return generatedBeatSchema.safeParse(data).success;
};
