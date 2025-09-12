'use client';

import { useDominantHand } from '../../providers/dominant-hand-provider';
import { ThemeSafe } from '../../providers/hydration-safe';
import { Button } from './Button';

export function DominantHand() {
	const { dominantHand, toggleDominantHand } = useDominantHand();

	const isRightHand = dominantHand === 'right';
	const displayText = isRightHand ? 'R' : 'L';
	const title = isRightHand ? 'Switch to Right Hand' : 'Switch to Left Hand';

	const backgroundColor = isRightHand ? 'bg-green' : 'bg-red';
	const textColor = 'text-white';

	return (
		<ThemeSafe
			fallback={
				<Button className='bg-gray hover:opacity-80' variant='icon' title='Loading…' disabled>
					<span className='text-white text-lg font-bold'>R</span>
				</Button>
			}
		>
			<Button
				className={`${backgroundColor} hover:opacity-80`}
				variant='icon'
				title={title}
				onClick={toggleDominantHand}
			>
				<span className={`${textColor} text-lg font-bold`}>{displayText}</span>
			</Button>
		</ThemeSafe>
	);
}
