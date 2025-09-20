import { memo } from 'react';
import { CHART_DATA, NOTE_TYPES, DURATION_CONFIGS } from '@/utils';
import type { DifficultyLevel, NoteTypeName } from '@/types';

const getNoteTypeSymbol = (noteTypeName: NoteTypeName): string => {
	const config = DURATION_CONFIGS.find(config => config.name === noteTypeName);
	return config?.symbol ?? noteTypeName.charAt(0).toLowerCase();
};

type NoteTypesTableProps = {
	difficulties: DifficultyLevel[];
};

function NoteTypesTableComponent({ difficulties }: NoteTypesTableProps) {
	return (
		<div
			className='flex flex-col gap-4 border border-black rounded-lg p-3 sm:p-4'
			role='region'
			aria-labelledby='note-types-title'
		>
			<h3 className='text-black text-base font-semibold sm:text-lg' id='note-types-title'>
				Difficulty vs. Note Types
			</h3>

			<div className='overflow-x-auto'>
				<table
					className='w-full'
					role='table'
					aria-label='Difficulty chart showing available note types and rest probabilities'
				>
					<thead>
						<tr className='border-b border-black'>
							<th className='flex-shrink-0 text-black text-xs font-medium text-left w-32 px-1 pb-2 sm:text-sm sm:px-2 sm:w-36'>
								Difficulty
							</th>
							<th
								className='flex-1 text-black text-xs font-medium text-center pb-2 sm:text-sm'
								colSpan={NOTE_TYPES.length}
							>
								Note Types
							</th>
							<th className='flex-shrink-0 text-black text-xs font-medium text-center w-20 px-1 pb-2 sm:text-sm sm:w-24 sm:px-2'>
								Rest %
							</th>
						</tr>
						<tr>
							<th></th>
							{NOTE_TYPES.map(note => (
								<th className='cursor-pointer text-center px-1' key={note.name}>
									<span className='font-musisync text-4xl font-extralight' title={note.name}>
										{getNoteTypeSymbol(note.name)}
									</span>
								</th>
							))}
							<th></th>
						</tr>
					</thead>
					<tbody>
						{difficulties.map(difficulty => {
							const data = CHART_DATA[difficulty];
							if (!data) return null;

							return (
								<tr
									className='border-b border-light-gray hover:bg-light-gray transition-colors'
									key={difficulty}
								>
									<td className='flex-shrink-0 text-black text-xs font-medium w-32 px-1 py-2 sm:text-sm sm:w-36 sm:px-2 sm:py-3'>
										{difficulty.replace("'", '')}
									</td>
									{NOTE_TYPES.map(note => {
										const isAvailable = data.notes.includes(note.name);
										return (
											<td key={note.name} className='text-center py-2 sm:py-3 px-1 sm:px-2'>
												{isAvailable && (
													<span
														className='text-green text-lg sm:text-xl'
														title={`${note.name} available`}
														role='img'
														aria-label={`${note.name} note available for ${difficulty}`}
													>
														✓
													</span>
												)}
											</td>
										);
									})}
									<td className='flex-shrink-0 text-gray text-xs font-medium text-center w-20 py-2 px-1 sm:text-sm sm:w-24 sm:px-2 sm:py-3'>
										{data.restProbability}%
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export const NoteTypesTable = memo(NoteTypesTableComponent, (prevProps, nextProps) => {
	return JSON.stringify(prevProps.difficulties) === JSON.stringify(nextProps.difficulties);
});

NoteTypesTable.displayName = 'NoteTypesTable';
