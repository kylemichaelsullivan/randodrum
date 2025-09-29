/**
 * UI-specific types and component props
 */

import type { DifficultyLevel } from './difficulty';
import type { DurationName } from './duration';
import type { DynamicName } from './dynamic';
import type { TechniqueTypeName } from './ornament';

export const DOMINANT_HANDS = ['left', 'right'] as const;

export type DominantHand = (typeof DOMINANT_HANDS)[number];

export type ChartData = Record<
	DifficultyLevel,
	{
		notes: DurationName[];
		dynamics: DynamicName[];
		techniques: TechniqueTypeName[];
		restProbability: number;
	}
>;
