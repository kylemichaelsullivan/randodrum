/**
 * UI-related constants and utilities
 */

import { DIFFICULTY_CONFIGS, DIFFICULTY_LEVELS } from './difficulty';
import {
	DURATION_DISPLAY_ORDER,
	getNameFromDuration,
	NAME_TO_DURATION_MAP,
	ORNAMENTS,
} from '@/types';

import type {
	ChartData,
	DurationType,
	DurationName,
	TechniqueTypeName,
	DynamicName,
} from '@/types';

export const TECHNIQUE_TYPES = ORNAMENTS.filter((item): item is TechniqueTypeName => item !== null);

function getAvailableDynamics(
	config: (typeof DIFFICULTY_CONFIGS)[keyof typeof DIFFICULTY_CONFIGS]
): DynamicName[] {
	const dynamics: DynamicName[] = ['Normal'];

	if (config.dynamicScale[0] < 1.0) {
		dynamics.push('Accent');
	}

	if (config.dynamicScale[1] < 1.0) {
		dynamics.push('Rimshot');
	}

	return dynamics;
}

function getAvailableTechniques(
	config: (typeof DIFFICULTY_CONFIGS)[keyof typeof DIFFICULTY_CONFIGS]
): TechniqueTypeName[] {
	const techniques: TechniqueTypeName[] = [];

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

		const notes: DurationName[] = [];
		for (const durationConfig of config.durations) {
			const noteName = getNameFromDuration(durationConfig.duration);
			if (noteName && !notes.includes(noteName)) {
				notes.push(noteName);
			}
		}

		const dynamics = getAvailableDynamics(config);
		const techniques = getAvailableTechniques(config);

		chartData[difficulty] = {
			notes,
			dynamics,
			techniques,
			restProbability: Math.round(config.restProbability * 100),
		};
	}

	return chartData;
}

export const CHART_DATA: ChartData = generateChartData();

export const NOTE_TYPES: readonly DurationType[] = DURATION_DISPLAY_ORDER.map(name => {
	const duration = NAME_TO_DURATION_MAP.get(name);
	if (!duration) throw new Error(`Duration not found for ${name}`);
	return {
		name: name,
		value: duration,
	};
});

export const DYNAMIC_DEFINITIONS: Record<DynamicName, string> = {
	Normal: 'Standard note with normal volume and timing',
	Accent: 'A note played louder than surrounding notes',
	Rimshot: 'A note played by hitting both the drumhead and rim simultaneously',
} as const;

export const TECHNIQUE_DEFINITIONS: Record<TechniqueTypeName, string> = {
	Flam: 'Two notes played almost simultaneously, with one slightly before the other',
	Drag: 'Two grace notes before a main note',
} as const;
