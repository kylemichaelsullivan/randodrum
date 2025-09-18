import { NoteTypesTable } from './NoteTypesTable';
import { TechniquesTable } from './TechniquesTable';
import { useChartData } from './useChartData';

export function DifficultyChart() {
	const chartData = useChartData();
	const difficulties = chartData.map(({ difficulty }) => difficulty);

	return (
		<div className='flex flex-col gap-6' role='region' aria-label='Difficulty charts'>
			<NoteTypesTable difficulties={difficulties} />
			<TechniquesTable difficulties={difficulties} />
		</div>
	);
}
