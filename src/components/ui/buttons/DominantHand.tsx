'use client';

import { Button } from './Button';
import { useDominantHand } from '@/components';

export function DominantHand() {
	const { dominantHand, toggleDominantHand } = useDominantHand();

	const isRightHand = dominantHand === 'right';
	const displayText = isRightHand ? 'R' : 'L';
	const title = isRightHand ? 'Switch to Right Hand' : 'Switch to Left Hand';

	const backgroundColor = isRightHand ? 'bg-green' : 'bg-red';
	const textColor = 'text-white';

	return (
		<Button
			className={`${backgroundColor} hover:opacity-80`}
			variant='icon'
			title={title}
			onClick={toggleDominantHand}
		>
			<span className={`${textColor} text-lg font-bold`}>{displayText}</span>
		</Button>
	);
}
