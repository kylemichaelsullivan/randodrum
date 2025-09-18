import { memo } from 'react';
import { CHART_DATA, TECHNIQUE_TYPES } from '@/utils';
import type { DifficultyLevel } from '@/types';

type TechniquesTableProps = {
	difficulties: DifficultyLevel[];
};

function TechniquesTableComponent({ difficulties }: TechniquesTableProps) {
	return (
		<div
			className='border border-black rounded-lg p-3 sm:p-4 flex flex-col gap-4'
			role='region'
			aria-labelledby='techniques-title'
		>
			<h3 className='font-semibold text-black text-base sm:text-lg' id='techniques-title'>
				Difficulty vs. Techniques
			</h3>

			<div className='overflow-x-auto'>
				<table
					className='w-full min-w-[300px] sm:min-w-[350px]'
					role='table'
					aria-label='Difficulty chart showing available techniques'
				>
					<thead>
						<tr className='border-b border-black'>
							<th className='flex-shrink-0 text-black text-xs font-medium text-left w-32 pb-2 px-1 sm:text-sm sm:px-2 sm:w-36'>
								Difficulty
							</th>
							<th
								className='flex-1 text-black text-xs font-medium text-center pb-2'
								colSpan={TECHNIQUE_TYPES.length}
							>
								Techniques
							</th>
						</tr>
						<tr>
							<th className='px-1 sm:px-2'></th>
							{TECHNIQUE_TYPES.map(technique => (
								<th key={technique} className='text-xs text-center px-0.5 sm:px-1'>
									{technique}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{difficulties.map(difficulty => {
							const data = CHART_DATA[difficulty];
							if (!data) return null;

							return (
								<tr
									key={difficulty}
									className='border-b border-light-gray hover:bg-light-gray transition-colors'
								>
									<td className='flex-shrink-0 text-black text-xs font-medium px-1 py-2 w-32 sm:text-sm sm:w-36 sm:px-2 sm:py-3'>
										{difficulty.replace("'", '')}
									</td>
									{TECHNIQUE_TYPES.map(technique => {
										const isAvailable = data.techniques.includes(technique);
										return (
											<td key={technique} className='text-center py-2 sm:py-3 px-1 sm:px-2'>
												{isAvailable && (
													<span
														className='text-green text-lg sm:text-xl'
														title={`${technique} available`}
														role='img'
														aria-label={`${technique} technique available for ${difficulty}`}
													>
														✓
													</span>
												)}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export const TechniquesTable = memo(TechniquesTableComponent, (prevProps, nextProps) => {
	return JSON.stringify(prevProps.difficulties) === JSON.stringify(nextProps.difficulties);
});

TechniquesTable.displayName = 'TechniquesTable';
