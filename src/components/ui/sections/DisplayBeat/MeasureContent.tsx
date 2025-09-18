import { memo } from 'react';
import { NoteDisplay } from './NoteDisplay';
import type { Measure } from '@/types';

type MeasureContentProps = {
	measure: Measure;
};

function MeasureContentComponent({ measure }: MeasureContentProps) {
	return (
		<div
			className={`MeasureContent flex flex-row flex-nowrap items-center justify-center gap-2 bg-white rounded p-3 min-h-[6.25rem]`}
		>
			{measure.map((note, noteIndex) => (
				<NoteDisplay note={note} key={noteIndex} />
			))}
		</div>
	);
}

export const MeasureContent = memo(MeasureContentComponent, (prevProps, nextProps) => {
	return JSON.stringify(prevProps.measure) === JSON.stringify(nextProps.measure);
});

MeasureContent.displayName = 'MeasureContent';
