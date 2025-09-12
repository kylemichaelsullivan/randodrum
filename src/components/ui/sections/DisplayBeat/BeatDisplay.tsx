import { NoteDisplay } from './NoteDisplay';
import type { Beat } from '@/types';

type BeatDisplayProps = {
	beat: Beat;
	beatIndex: number;
};

export function BeatDisplay({ beat, beatIndex }: BeatDisplayProps) {
	return (
		<div className='flex flex-col gap-2 bg-white border border-light-gray rounded-lg p-3 min-w-[200px]'>
			<div className='text-gray text-sm font-medium text-center'>Beat {beatIndex + 1}</div>
			<div className='flex justify-center gap-2 flex-wrap'>
				{beat.notes.map((note, noteIndex) => (
					<NoteDisplay note={note} key={noteIndex} />
				))}
			</div>
		</div>
	);
}
