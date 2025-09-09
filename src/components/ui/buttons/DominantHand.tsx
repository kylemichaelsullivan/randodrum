'use client';

import { useDominantHand } from '../../providers/dominant-hand-provider';
import { Button } from './Button';

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
			<span className={`text-lg font-bold ${textColor}`}>{displayText}</span>
		</Button>
	);
}
