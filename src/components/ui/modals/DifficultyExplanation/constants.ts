import type { DifficultyLevel } from '@/types';

export type NoteType = {
	name: string;
	value: number;
	color: string;
};

export type TechniqueType = {
	name: string;
	color: string;
};

export const NOTE_TYPES: NoteType[] = [
	{ name: 'Whole', value: 32, color: 'bg-red' },
	{ name: 'Half', value: 16, color: 'bg-orange-500' },
	{ name: 'Quarter', value: 8, color: 'bg-yellow-500' },
	{ name: 'Eighth', value: 4, color: 'bg-green' },
	{ name: 'Sixteenth', value: 2, color: 'bg-blue' },
	{ name: 'Thirty-Second', value: 1, color: 'bg-purple-500' },
	{ name: 'Triplets', value: 8 / 3, color: 'bg-pink-500' },
	{ name: 'Sixtuplets', value: 4 / 6, color: 'bg-indigo-500' },
];

export const TECHNIQUE_TYPES: TechniqueType[] = [
	{ name: 'Basic', color: 'bg-gray' },
	{ name: 'Accent', color: 'bg-red' },
	{ name: 'Flam', color: 'bg-orange-500' },
	{ name: 'Drag', color: 'bg-yellow-500' },
	{ name: 'Ghost', color: 'bg-blue' },
];

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
	'I’m Too Young to Drum',
	'Hey, Not Too Rough',
	'Hurt Me Plenty',
	'Ultra-Violence',
	'Drumline!',
];

export type ChartData = {
	[difficulty: string]: {
		notes: string[];
		techniques: string[];
		restProbability: number;
	};
};

export const CHART_DATA: ChartData = {
	'I’m Too Young to Drum': {
		notes: ['Whole', 'Half', 'Quarter'],
		techniques: ['Basic'],
		restProbability: 30,
	},
	'Hey, Not Too Rough': {
		notes: ['Whole', 'Half', 'Quarter', 'Eighth'],
		techniques: ['Basic', 'Accent', 'Flam'],
		restProbability: 20,
	},
	'Hurt Me Plenty': {
		notes: ['Whole', 'Half', 'Quarter', 'Eighth', 'Sixteenth'],
		techniques: ['Basic', 'Accent', 'Flam', 'Drag'],
		restProbability: 15,
	},
	'Ultra-Violence': {
		notes: ['Whole', 'Half', 'Quarter', 'Eighth', 'Sixteenth', 'Thirty-Second', 'Sixtuplets'],
		techniques: ['Basic', 'Accent', 'Flam', 'Drag', 'Ghost'],
		restProbability: 10,
	},
	'Drumline!': {
		notes: [
			'Whole',
			'Half',
			'Quarter',
			'Eighth',
			'Sixteenth',
			'Thirty-Second',
			'Triplets',
			'Sixtuplets',
		],
		techniques: ['Basic', 'Accent', 'Flam', 'Drag', 'Ghost'],
		restProbability: 5,
	},
};
