/**
 * Unified validation system using Zod
 */

import { z } from 'zod';

import { DYNAMICS } from './beat';
import { DIFFICULTY_LEVELS } from './difficulty';

// ============================================================================
// BASIC TYPE SCHEMAS
// ============================================================================

export const difficultyLevelSchema = z.enum(DIFFICULTY_LEVELS as [string, ...string[]]);

export const durationValueSchema = z.union([
	z.literal(2), // Sixteenth Sixtuplet (1/12 beat)
	z.literal(3), // Thirty-Second Note (1/8 beat)
	z.literal(4), // Eighth Sixtuplet (1/6 beat)
	z.literal(6), // Sixteenth Note (1/4 beat)
	z.literal(8), // Eighth Triplet (1/3 beat)
	z.literal(9), // Dotted Sixteenth Note (3/8 beat)
	z.literal(12), // Eighth Note (1/2 beat)
	z.literal(16), // Quarter Triplet (2/3 beat)
	z.literal(18), // Dotted Eighth Note (3/4 beat)
	z.literal(24), // Quarter Note (1 beat)
	z.literal(36), // Dotted Quarter Note (3/2 beats)
	z.literal(48), // Half Note (2 beats)
	z.literal(72), // Dotted Half Note (3 beats)
	z.literal(96), // Whole Note (4 beats)
]);

export const dynamicNameSchema = z.enum(DYNAMICS as [string, ...string[]]);

export const noteTypeNameSchema = z.enum([
	// Straight notes
	'Whole',
	'Dotted Half',
	'Half',
	'Dotted Quarter',
	'Quarter',
	'Dotted Eighth',
	'Eighth',
	'Dotted Sixteenth',
	'Sixteenth',
	'Thirty-Second',
	// Triplets
	'Quarter Triplet',
	'Eighth Triplet',
	// Sixtuplets
	'Eighth Sixtuplet',
	'Sixteenth Sixtuplet',
]);

export const ornamentNameSchema = z.union([z.literal('flam'), z.literal('drag'), z.null()]);

export const techniqueTypeNameSchema = z.enum(['Basic', 'Accent', 'Flam', 'Drag', 'Ghost']);

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
