/**
 * UI-related constants and utilities
 */

import { DIFFICULTY_CONFIGS } from './difficulty';
import {
	createConfigArray,
	DIFFICULTY_LEVELS,
	DURATION_DISPLAY_ORDER,
	DURATION_TO_NAME_MAP,
	DURATION_NAME_TO_VALUE_MAP,
} from '@/types';

import type { ChartData, DurationName, TechniqueTypeName, DynamicName } from '@/types';

function getAvailableDynamics(
	config: (typeof DIFFICULTY_CONFIGS)[keyof typeof DIFFICULTY_CONFIGS]
): DynamicName[] {
	const dynamics: DynamicName[] = ['Normal'];
	const [accentThreshold, rimshotThreshold] = config.dynamicThresholds;

	if (accentThreshold < 1.0) {
		dynamics.push('Accent');
	}

	if (rimshotThreshold < 1.0) {
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
			const noteName = DURATION_TO_NAME_MAP.get(durationConfig.duration);
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

export const NOTE_TYPES = createConfigArray(DURATION_DISPLAY_ORDER, DURATION_NAME_TO_VALUE_MAP);

const DYNAMIC_DEFINITIONS_MAP: Record<DynamicName, string> = {
	Normal: 'Standard note with normal volume and timing',
	Accent: 'A note played louder than surrounding notes',
	Rimshot: 'A note played by hitting both the drumhead and rim simultaneously',
} as const;

const TECHNIQUE_DEFINITIONS_MAP: Record<TechniqueTypeName, string> = {
	Flam: 'Two notes played almost simultaneously, with one slightly before the other',
	Drag: 'Two grace notes before a main note',
} as const;

export const DYNAMIC_DEFINITIONS = DYNAMIC_DEFINITIONS_MAP;
export const TECHNIQUE_DEFINITIONS = TECHNIQUE_DEFINITIONS_MAP;
