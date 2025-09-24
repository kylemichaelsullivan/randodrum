import type { DifficultyLevel, GeneratedBeat, Measure, Note } from '@/types';

export const mockBeatFormData = {
	beats: 4,
	difficulty: 'I’m Too Young to Drum' as DifficultyLevel,
	measures: 4,
};

export const mockMeasure: Measure = [
	{
		dur: 24,
		dynamic: 'Normal',
		isDominant: true,
		ornament: null,
		start: 0,
		isRest: false,
	}, // Quarter Note
	{
		dur: 24,
		dynamic: 'Normal',
		isDominant: false,
		ornament: null,
		start: 24,
		isRest: false,
	}, // Quarter Note
	{
		dur: 24,
		dynamic: 'Normal',
		isDominant: true,
		ornament: null,
		start: 48,
		isRest: false,
	}, // Quarter Note
	{
		dur: 24,
		dynamic: 'Normal',
		isDominant: false,
		ornament: null,
		start: 72,
		isRest: false,
	}, // Quarter Note
];

export const mockComplexMeasure: Measure = [
	{
		dur: 12,
		dynamic: 'Accent',
		isDominant: true,
		ornament: 'Flam',
		start: 0,
		isRest: false,
	}, // Eighth Note
	{
		dur: 12,
		dynamic: 'Normal',
		isDominant: false,
		ornament: null,
		start: 12,
		isRest: false,
	}, // Eighth Note
	{
		dur: 12,
		dynamic: 'Normal',
		isDominant: true,
		ornament: 'Flam',
		start: 24,
		isRest: false,
	}, // Eighth Note
	{
		dur: 12,
		dynamic: 'Accent',
		isDominant: false,
		ornament: null,
		start: 36,
		isRest: false,
	}, // Eighth Note
	{
		dur: 12,
		dynamic: 'Normal',
		isDominant: true,
		ornament: null,
		start: 48,
		isRest: false,
	}, // Eighth Note
	{
		dur: 12,
		dynamic: 'Accent',
		isDominant: false,
		ornament: 'Flam',
		start: 60,
		isRest: false,
	}, // Eighth Note
	{
		dur: 12,
		dynamic: 'Normal',
		isDominant: true,
		ornament: null,
		start: 72,
		isRest: false,
	}, // Eighth Note
	{
		dur: 12,
		dynamic: 'Normal',
		isDominant: false,
		ornament: 'Flam',
		start: 84,
		isRest: false,
	}, // Eighth Note
];

export const mockGeneratedBeat: GeneratedBeat = {
	beatsPerMeasure: 4,
	difficulty: 'I’m Too Young to Drum',
	measures: [mockMeasure, mockMeasure, mockMeasure, mockMeasure],
};

export const mockNote: Note = {
	dur: 24, // Quarter Note
	dynamic: 'Normal',
	isDominant: true,
	ornament: null,
	start: 0,
	isRest: false,
};

export const mockUltraViolenceBeat: GeneratedBeat = {
	beatsPerMeasure: 4,
	difficulty: 'Ultra-Violence',
	measures: [mockComplexMeasure, mockComplexMeasure, mockComplexMeasure, mockComplexMeasure],
};
