import type { DifficultyLevel, GeneratedBeat, Measure, Note } from '@/types';

export const mockBeatFormData = {
	beats: 4,
	difficulty: 'I’m Too Young to Drum' as DifficultyLevel,
	measures: 4,
};

export const mockMeasure: Measure = [
	{ dynamic: 'normal', dur: 24, isDominant: true, ornament: null, start: 0 }, // Quarter Note
	{ dynamic: 'normal', dur: 24, isDominant: false, ornament: null, start: 24 }, // Quarter Note
	{ dynamic: 'normal', dur: 24, isDominant: true, ornament: null, start: 48 }, // Quarter Note
	{ dynamic: 'normal', dur: 24, isDominant: false, ornament: null, start: 72 }, // Quarter Note
];

export const mockComplexMeasure: Measure = [
	{ dynamic: 'accent', dur: 12, isDominant: true, ornament: 'flam', start: 0 }, // Eighth Note
	{ dynamic: 'normal', dur: 12, isDominant: false, ornament: null, start: 12 }, // Eighth Note
	{ dynamic: 'normal', dur: 12, isDominant: true, ornament: 'flam', start: 24 }, // Eighth Note
	{ dynamic: 'accent', dur: 12, isDominant: false, ornament: null, start: 36 }, // Eighth Note
	{ dynamic: 'normal', dur: 12, isDominant: true, ornament: null, start: 48 }, // Eighth Note
	{ dynamic: 'accent', dur: 12, isDominant: false, ornament: 'flam', start: 60 }, // Eighth Note
	{ dynamic: 'normal', dur: 12, isDominant: true, ornament: null, start: 72 }, // Eighth Note
	{ dynamic: 'normal', dur: 12, isDominant: false, ornament: 'flam', start: 84 }, // Eighth Note
];

export const mockGeneratedBeat: GeneratedBeat = {
	beatsPerMeasure: 4,
	difficulty: 'I’m Too Young to Drum',
	measures: [mockMeasure, mockMeasure, mockMeasure, mockMeasure],
};

export const mockNote: Note = {
	dynamic: 'normal',
	dur: 24, // Quarter Note
	isDominant: true,
	ornament: null,
	start: 0,
};

export const mockUltraViolenceBeat: GeneratedBeat = {
	beatsPerMeasure: 4,
	difficulty: 'Ultra-Violence',
	measures: [mockComplexMeasure, mockComplexMeasure, mockComplexMeasure, mockComplexMeasure],
};
