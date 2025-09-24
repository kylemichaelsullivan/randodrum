import { NoteTypesTable } from './NoteTypesTable';
import { PlayingStylesTable } from './PlayingStylesTable';
import { SectionWrapper } from './SectionWrapper';
import { useChartData } from './useChartData';

export function DifficultyChart() {
	const chartData = useChartData();
	const difficulties = chartData.map(({ difficulty }) => difficulty);

	return (
		<SectionWrapper ariaLabel='Difficulty charts'>
			<NoteTypesTable difficulties={difficulties} />
			<PlayingStylesTable difficulties={difficulties} />
		</SectionWrapper>
	);
}
