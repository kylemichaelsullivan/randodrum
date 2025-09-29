import { CHART_DATA } from '@/utils';
import { DifficultyTable } from './DifficultyTable';
import { TECHNIQUE_TYPES } from '@/types';

import type { DifficultyLevel } from '@/types';

type TechniquesTableProps = {
	difficulties: DifficultyLevel[];
};

export function TechniquesTable({ difficulties }: TechniquesTableProps) {
	const techniqueDisplayNames = TECHNIQUE_TYPES;

	const getAvailableTechniques = (difficulty: DifficultyLevel) => {
		const data = CHART_DATA[difficulty];
		if (!data) return [];
		return data.techniques;
	};

	return (
		<DifficultyTable
			difficulties={difficulties}
			title='Techniques'
			items={techniqueDisplayNames}
			getAvailableItems={getAvailableTechniques}
			ariaLabel='Difficulty chart showing available techniques'
		/>
	);
}
