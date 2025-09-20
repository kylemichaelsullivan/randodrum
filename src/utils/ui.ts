/**
 * UI-related constants and utilities
 */

import { DIFFICULTY_CONFIGS, DIFFICULTY_LEVELS } from './difficulty';
import { DURATION_CONFIGS, DURATION_DISPLAY_ORDER } from './constants';

import type { ChartData, NoteType, NoteTypeName, TechniqueTypeName } from '@/types';

function getAvailableTechniques(
	config: (typeof DIFFICULTY_CONFIGS)[keyof typeof DIFFICULTY_CONFIGS]
): TechniqueTypeName[] {
	const techniques: TechniqueTypeName[] = ['Basic'];

	if (config.dynamicScale[0] < 1.0) {
		techniques.push('Accent');
	}

	if (config.dynamicScale[1] < 1.0) {
		techniques.push('Rimshot');
	}

	if (config.flamThreshold > 0) {
		techniques.push('Flam');
	}

	if (config.dragThreshold > 0) {
		techniques.push('Drag');
	}

	return techniques;
}

function generateChartData(): ChartData {
	const chartData: ChartData = {} as ChartData;

	for (const difficulty of DIFFICULTY_LEVELS) {
		const config = DIFFICULTY_CONFIGS[difficulty];

		const notes: NoteTypeName[] = [];
		for (const durationConfig of config.durations) {
			const durationConfigFound = DURATION_CONFIGS.find(d => d.value === durationConfig.duration);
			if (durationConfigFound && !notes.includes(durationConfigFound.name)) {
				notes.push(durationConfigFound.name);
			}
		}

		const techniques = getAvailableTechniques(config);

		chartData[difficulty] = {
			notes,
			techniques,
			restProbability: Math.round(config.restProbability * 100),
		};
	}

	return chartData;
}

export const CHART_DATA: ChartData = generateChartData();

export const NOTE_TYPES: readonly NoteType[] = DURATION_DISPLAY_ORDER.map(name => {
	const config = DURATION_CONFIGS.find(c => c.name === name);
	if (!config) throw new Error(`Duration config not found for ${name}`);
	return {
		name: config.name,
		value: config.value,
	};
});

export const TECHNIQUE_TYPES: readonly TechniqueTypeName[] = [
	'Basic',
	'Accent',
	'Flam',
	'Drag',
	'Rimshot',
] as const;

export const TECHNIQUE_DEFINITIONS: Record<TechniqueTypeName, string> = {
	Basic: 'Standard note with normal volume and timing',
	Accent: 'A note played louder than surrounding notes',
	Flam: 'Two notes played almost simultaneously, with one slightly before the other',
	Drag: 'Two grace notes before a main note',
	Rimshot: 'A note played by hitting both the drumhead and rim simultaneously',
} as const;
