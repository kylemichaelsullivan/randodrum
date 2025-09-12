import { NOTE_TYPES } from './constants';

export function ChartHeader() {
	return (
		<thead>
			<tr className='border-b border-black'>
				<th className='w-28 sm:w-32 flex-shrink-0 text-xs sm:text-sm font-medium text-black text-left pb-2 px-1 sm:px-2'>
					Difficulty
				</th>
				<th
					className='flex-1 text-xs font-medium text-black text-center pb-2'
					colSpan={NOTE_TYPES.length}
				>
					Note Types
				</th>
				<th className='w-20 sm:w-24 flex-shrink-0 text-xs font-medium text-black text-center pb-2 px-1 sm:px-2'>
					Rest %
				</th>
			</tr>
			<tr>
				<th className='px-1 sm:px-2'></th>
				{NOTE_TYPES.map(note => (
					<th key={note.name} className='text-xs text-center px-0.5 sm:px-1'>
						{note.name}
					</th>
				))}
				<th className='px-1 sm:px-2'></th>
			</tr>
		</thead>
	);
}
