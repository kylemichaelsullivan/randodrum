import { BeatDisplay } from './BeatDisplay';
import type { Measure } from '@/types';

type MeasureDisplayProps = {
	measure: Measure;
	measureIndex: number;
};

export function MeasureDisplay({ measure, measureIndex }: MeasureDisplayProps) {
	return (
		<div className='flex flex-col gap-3 bg-black border border-light-gray rounded-lg p-4'>
			<div className='text-light-gray text-lg font-semibold text-center'>
				Measure {measureIndex + 1}
			</div>
			<div className='flex flex-wrap gap-3 justify-center'>
				{measure.beats.map((beat, beatIndex) => (
					<BeatDisplay beat={beat} beatIndex={beatIndex} key={beatIndex} />
				))}
			</div>
		</div>
	);
}
