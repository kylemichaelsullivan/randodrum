import { NOTE_TYPES, CHART_DATA } from './constants';
import type { DifficultyLevel } from '@/types';

type ChartRowProps = {
	difficulty: DifficultyLevel;
};

export function ChartRow({ difficulty }: ChartRowProps) {
	const data = CHART_DATA[difficulty];
	if (!data) return null;

	return (
		<tr className='border-b border-light-gray hover:bg-light-gray transition-colors'>
			<td className='w-28 sm:w-32 flex-shrink-0 text-xs sm:text-sm text-black py-2 sm:py-3 px-1 sm:px-2 font-medium'>
				{difficulty.replace("'", '')}
			</td>
			{NOTE_TYPES.map(note => {
				const isAvailable = data.notes.includes(note.name);
				return (
					<td key={note.name} className='text-center py-2 sm:py-3 px-0.5 sm:px-1'>
						<div
							className={`w-3 h-3 sm:w-4 sm:h-4 rounded mx-auto ${isAvailable ? note.color : 'bg-light-gray'}`}
							title={`${note.name} ${isAvailable ? 'available' : 'not available'}`}
							role='img'
							aria-label={`${note.name} note ${isAvailable ? 'available' : 'not available'} for ${difficulty}`}
						/>
					</td>
				);
			})}
			<td className='w-20 sm:w-24 flex-shrink-0 text-xs sm:text-sm text-center text-gray py-2 sm:py-3 px-1 sm:px-2 font-medium'>
				{data.restProbability}%
			</td>
		</tr>
	);
}
