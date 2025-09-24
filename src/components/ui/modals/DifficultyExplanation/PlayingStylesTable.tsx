import { DYNAMICS, CHART_DATA } from '@/utils';
import { DifficultyTable } from './DifficultyTable';

import type { DifficultyLevel } from '@/types';

type PlayingStylesTableProps = {
	difficulties: DifficultyLevel[];
};

export function PlayingStylesTable({ difficulties }: PlayingStylesTableProps) {
	const getAvailableDynamics = (difficulty: DifficultyLevel) => {
		const data = CHART_DATA[difficulty];
		if (!data) return [];
		return data.dynamics;
	};

	return (
		<DifficultyTable
			difficulties={difficulties}
			items={DYNAMICS}
			getAvailableItems={getAvailableDynamics}
			title='Dynamics'
			ariaLabel='Difficulty chart showing available dynamics'
		/>
	);
}
