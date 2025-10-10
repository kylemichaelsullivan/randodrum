import { memo, useMemo } from 'react';
import { NoteDisplay } from './NoteDisplay';
import { createDisplayMeasure } from '@/utils';
import type { Measure } from '@/types';

type MeasureContentProps = {
	measure: Measure;
};

function MeasureContentComponent({ measure }: MeasureContentProps) {
	const displayMeasure = useMemo(() => createDisplayMeasure(measure), [measure]);

	return (
		<div
			className={`MeasureContent flex flex-row flex-nowrap items-center justify-center bg-white rounded p-3 min-h-[6.25rem]`}
		>
			{displayMeasure.map((displayUnit, index) => (
				<NoteDisplay displayUnit={displayUnit} key={index} />
			))}
		</div>
	);
}

export const MeasureContent = memo(MeasureContentComponent, (prevProps, nextProps) => {
	return JSON.stringify(prevProps.measure) === JSON.stringify(nextProps.measure);
});

MeasureContent.displayName = 'MeasureContent';
