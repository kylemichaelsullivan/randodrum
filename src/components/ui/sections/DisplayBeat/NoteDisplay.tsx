import type { BeatNote } from '@/types';

type NoteDisplayProps = {
	note: BeatNote;
};

export function NoteDisplay({ note }: NoteDisplayProps) {
	const getDrumNoteSymbol = (value: number) => {
		if (value === 8) return '●'; // Quarter note (drum)
		if (value === 4) return '●'; // Eighth note (drum)
		if (value === 2) return '●'; // Sixteenth note (drum)
		if (value === 1) return '●'; // Thirty-second note (drum)
		if (value === 8 / 3) return '●₃'; // Quarter triplet
		if (value === 4 / 3) return '●₃'; // Eighth triplet
		if (value === 2 / 3) return '●₃'; // Sixteenth triplet
		if (value === 4 / 6) return '●₆'; // Sixtuplet
		return '●'; // Default drum note
	};

	const getTechniqueSymbol = (technique?: string) => {
		switch (technique) {
			case 'accent':
				return '>';
			case 'flam':
				return 'f';
			case 'drag':
				return 'd';
			case 'ghost':
				return '(';
			default:
				return '';
		}
	};

	const getStickingColor = (sticking: 'R' | 'L') => {
		return sticking === 'R' ? 'text-green' : 'text-red';
	};

	return (
		<div
			className={`inline-flex flex-col items-center px-1 ${note.isRest ? 'text-gray' : 'text-black'}`}
		>
			{note.isRest ?
				<div className='flex flex-col items-center'>
					<span className='text-lg'>𝄽</span>
					<span className='text-xs text-gray'>-</span>
				</div>
			:	<div className='flex flex-col items-center'>
					<span className='text-lg'>{getDrumNoteSymbol(note.value)}</span>
					<span className={`text-xs font-bold ${getStickingColor(note.sticking)}`}>
						{note.sticking}
					</span>
					{note.technique && (
						<span className='text-xs text-orange-600 font-medium'>
							{getTechniqueSymbol(note.technique)}
						</span>
					)}
				</div>
			}
		</div>
	);
}
