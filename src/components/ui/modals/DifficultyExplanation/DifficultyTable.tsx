import { memo } from 'react';

import type { DifficultyLevel } from '@/types';

type DifficultyTableProps<T extends string> = {
	difficulties: DifficultyLevel[];
	title: string;
	items: readonly T[];
	getAvailableItems: (difficulty: DifficultyLevel) => T[];
	ariaLabel: string;
	minWidth?: string;
};

function DifficultyTableComponent<T extends string>({
	difficulties,
	title,
	items,
	getAvailableItems,
	ariaLabel,
	minWidth = 'min-w-[300px] sm:min-w-[350px]',
}: DifficultyTableProps<T>) {
	return (
		<div
			className='DifficultyTable flex flex-col gap-4 border border-black rounded-lg p-3 sm:p-4'
			role='region'
			aria-labelledby={`${title.toLowerCase().replace(/\s+/g, '-')}-title`}
		>
			<h3
				className='font-semibold text-black text-base sm:text-lg'
				id={`${title.toLowerCase().replace(/\s+/g, '-')}-title`}
			>
				Difficulty vs. {title}
			</h3>

			<div className='overflow-x-auto'>
				<table className={`w-full ${minWidth}`} role='table' aria-label={ariaLabel}>
					<thead>
						<tr className='border-b border-black'>
							<th></th>
							{items.map(item => (
								<th className='text-sm text-center px-1' key={item}>
									{item}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{difficulties.map(difficulty => {
							const availableItems = getAvailableItems(difficulty);

							return (
								<tr
									className='border-b border-light-gray hover:bg-light-gray transition-colors'
									key={difficulty}
								>
									<td className='flex-shrink-0 text-black text-xs font-medium w-32 py-2 sm:text-sm sm:w-36 sm:py-3'>
										{difficulty.replace("'", '')}
									</td>
									{items.map(item => {
										const isAvailable = availableItems.includes(item);
										return (
											<td className='text-center py-2 sm:py-3' key={item}>
												{isAvailable && (
													<span
														className='text-green text-lg sm:text-xl'
														title={`${item} available`}
														role='img'
														aria-label={`${item} available for ${difficulty}`}
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

export const DifficultyTable = memo(DifficultyTableComponent);
DifficultyTable.displayName = 'DifficultyTable';
