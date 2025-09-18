/**
 * UI-specific types and component props
 */

import type { DifficultyLevel } from './difficulty';
import type { NoteTypeName } from './noteType';

// Dominant hand type
export type DominantHand = 'left' | 'right';

// Technique type name constants
export type TechniqueTypeName = 'Accent' | 'Basic' | 'Drag' | 'Flam' | 'Ghost';

// Chart data configuration
export type ChartData = Record<
	DifficultyLevel,
	{
		notes: NoteTypeName[];
		techniques: TechniqueTypeName[];
		restProbability: number;
	}
>;
