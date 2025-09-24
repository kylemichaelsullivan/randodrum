/**
 * UI-specific types and component props
 */

import type { DifficultyLevel } from './difficulty';
import type { DurationName } from './durations';
import type { DynamicName } from './dynamic';
import type { OrnamentName } from './ornament';

export type DominantHand = 'left' | 'right';

// Filter out null from ornaments to get only actual techniques
export type TechniqueTypeName = Exclude<OrnamentName, null>;

export type ChartData = Record<
	DifficultyLevel,
	{
		notes: DurationName[];
		dynamics: DynamicName[];
		techniques: TechniqueTypeName[];
		restProbability: number;
	}
>;
