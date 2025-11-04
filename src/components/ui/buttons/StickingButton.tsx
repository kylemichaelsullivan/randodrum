'use client';

import clsx from 'clsx';
import { Button } from './Button';
import { HydrationSafe, useSticking } from '@/components';

export function StickingButton() {
	const { sticking, toggleSticking, hideSticking, isStickingHidden } =
		useSticking();

	const isRightHand = sticking === 'right';
	const displayText = isRightHand ? 'R' : 'L';
	const title = isRightHand ? 'Switch to Right Hand' : 'Switch to Left Hand';

	const backgroundColor = isRightHand ? 'bg-green' : 'bg-red';
	const textColor = 'text-white';
	const buttonClassName = clsx(
		!isStickingHidden ? backgroundColor : 'bg-gray',
		'hover:opacity-60',
	);

	return (
		<HydrationSafe
			fallback={
				<Button
					variant='icon'
					className='bg-gray'
					title='Loading sticking…'
					disabled
				>
					<span className='text-lg font-bold text-white'>R</span>
				</Button>
			}
		>
			<Button
				variant='icon'
				className={buttonClassName}
				componentName='StickingButton'
				title={title}
				onClick={toggleSticking}
				onDoubleClick={hideSticking}
			>
				<span className={`${textColor} text-lg font-bold`}>{displayText}</span>
			</Button>
		</HydrationSafe>
	);
}
