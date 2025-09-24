/**
 * Unified validation system using Zod
 */

import { z, type ZodLiteral } from 'zod';
import { DIFFICULTY_LEVELS } from './difficulty';
import { DURATIONS, DYNAMICS, ORNAMENTS } from './beat';
import { DURATION_DISPLAY_ORDER } from '@/types';
import { TECHNIQUE_TYPES } from './ui';

// ============================================================================
// BASIC TYPE SCHEMAS
// ============================================================================

export const difficultyLevelSchema = z.enum(
	DIFFICULTY_LEVELS.map(level => level) as [string, ...string[]]
);

export const durationValueSchema = z.union([...DURATIONS.map(duration => z.literal(duration))] as [
	ZodLiteral<number>,
	ZodLiteral<number>,
	...ZodLiteral<number>[],
]);

export const dynamicNameSchema = z.enum(DYNAMICS.map(dynamic => dynamic) as [string, ...string[]]);

export const noteTypeNameSchema = z.enum(DURATION_DISPLAY_ORDER as [string, ...string[]]);

export const ornamentNameSchema = z.union([...ORNAMENTS.map(ornament => z.literal(ornament))] as [
	ZodLiteral<string | null>,
	ZodLiteral<string | null>,
	...ZodLiteral<string | null>[],
]);

export const techniqueTypeNameSchema = z.enum(
	TECHNIQUE_TYPES.map(type => type) as [string, ...string[]]
);

// ============================================================================
// COMPLEX OBJECT SCHEMAS
// ============================================================================

export const noteSchema = z.object({
	start: z.number().min(0),
	dur: durationValueSchema,
	dynamic: dynamicNameSchema,
	isDominant: z.boolean(),
	ornament: ornamentNameSchema,
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
// INDIVIDUAL TYPE VALIDATION FUNCTIONS
// ============================================================================

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

// ============================================================================
// COMPLEX OBJECT VALIDATION FUNCTIONS
// ============================================================================

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

// ============================================================================
// SAFE VALIDATION FUNCTIONS
// ============================================================================

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

// ============================================================================
// TYPE GUARDS
// ============================================================================

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
