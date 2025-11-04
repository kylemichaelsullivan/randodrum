import { memo } from 'react';
import { DisplayMeasures } from './DisplayMeasures';

function DisplayBodyComponent() {
	return (
		<div className='DisplayBody flex w-full flex-auto flex-wrap justify-start'>
			<DisplayMeasures />
		</div>
	);
}

export const DisplayBody = memo(DisplayBodyComponent);
