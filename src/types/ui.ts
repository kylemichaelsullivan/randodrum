/**
 * UI-specific types and component props
 */

import type { DifficultyLevel } from './difficulty';
import type { NoteTypeName } from './noteType';

export type DominantHand = 'left' | 'right';

export type TechniqueTypeName = 'Accent' | 'Basic' | 'Drag' | 'Flam' | 'Rimshot';

export type ChartData = Record<
	DifficultyLevel,
	{
		notes: NoteTypeName[];
		techniques: TechniqueTypeName[];
		restProbability: number;
	}
>;
