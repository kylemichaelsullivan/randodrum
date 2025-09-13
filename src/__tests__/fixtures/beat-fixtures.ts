import type { GeneratedBeat, Note, Measure, DifficultyLevel } from '@/types';

export const mockNote: Note = {
	start: 0,
	dur: 8,
	isDominant: true,
	dynamic: 'normal',
	ornament: null,
};

export const mockMeasure: Measure = [
	{ start: 0, dur: 8, isDominant: true, dynamic: 'normal', ornament: null },
	{ start: 8, dur: 8, isDominant: false, dynamic: 'normal', ornament: null },
	{ start: 16, dur: 8, isDominant: true, dynamic: 'normal', ornament: null },
	{ start: 24, dur: 8, isDominant: false, dynamic: 'normal', ornament: null },
];

export const mockGeneratedBeat: GeneratedBeat = {
	measures: [mockMeasure, mockMeasure, mockMeasure, mockMeasure],
	beatsPerMeasure: 4,
	difficulty: 'I’m Too Young to Drum',
};

export const mockBeatFormData = {
	beats: 4,
	measures: 4,
	difficulty: 'I’m Too Young to Drum' as DifficultyLevel,
};

export const mockComplexMeasure: Measure = [
	{ start: 0, dur: 4, isDominant: true, dynamic: 'accent', ornament: 'flam' },
	{ start: 4, dur: 4, isDominant: false, dynamic: 'normal', ornament: null },
	{ start: 8, dur: 4, isDominant: true, dynamic: 'normal', ornament: 'flam' },
	{ start: 12, dur: 4, isDominant: false, dynamic: 'accent', ornament: null },
	{ start: 16, dur: 4, isDominant: true, dynamic: 'normal', ornament: null },
	{ start: 20, dur: 4, isDominant: false, dynamic: 'accent', ornament: 'flam' },
	{ start: 24, dur: 4, isDominant: true, dynamic: 'normal', ornament: null },
	{ start: 28, dur: 4, isDominant: false, dynamic: 'normal', ornament: 'flam' },
];

export const mockUltraViolenceBeat: GeneratedBeat = {
	measures: [mockComplexMeasure, mockComplexMeasure, mockComplexMeasure, mockComplexMeasure],
	beatsPerMeasure: 4,
	difficulty: 'Ultra-Violence',
};
