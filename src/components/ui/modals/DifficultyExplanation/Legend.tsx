import { NOTE_TYPES, TECHNIQUE_TYPES } from './constants';
import { LegendItem } from './LegendItem';

export function Legend() {
	return (
		<div className='flex flex-col gap-4 sm:gap-6 pt-4'>
			<div className='flex flex-col gap-3'>
				<h4 className='text-sm sm:text-base font-semibold text-black'>Note Types Legend:</h4>
				<div className='flex flex-wrap gap-2 sm:gap-3'>
					{NOTE_TYPES.map(note => (
						<LegendItem name={note.name} color={note.color} key={note.name} />
					))}
				</div>
			</div>

			<div className='flex flex-col gap-3'>
				<h4 className='text-sm sm:text-base font-semibold text-black'>Techniques Legend:</h4>
				<div className='flex flex-wrap gap-2 sm:gap-3'>
					{TECHNIQUE_TYPES.map(technique => (
						<LegendItem name={technique.name} color={technique.color} key={technique.name} />
					))}
				</div>
			</div>
		</div>
	);
}
