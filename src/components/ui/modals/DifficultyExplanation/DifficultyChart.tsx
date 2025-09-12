import { ChartHeader } from './ChartHeader';
import { ChartRow } from './ChartRow';
import { useChartData } from './useChartData';

export function DifficultyChart() {
	const chartData = useChartData();

	return (
		<div
			className='border border-black rounded-lg p-3 sm:p-4 flex flex-col gap-4'
			role='region'
			aria-labelledby='chart-title'
		>
			<h3 className='font-semibold text-black text-base sm:text-lg' id='chart-title'>
				Difficulty vs. Note Types & Techniques
			</h3>

			<div className='overflow-x-auto -mx-3 sm:-mx-4 px-3 sm:px-4'>
				<table
					className='w-full min-w-[450px] sm:min-w-[500px]'
					role='table'
					aria-label='Difficulty chart showing available note types and rest probabilities'
				>
					<ChartHeader />
					<tbody>
						{chartData.map(({ difficulty }) => (
							<ChartRow difficulty={difficulty} key={difficulty} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
