'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';

import { Button, HydrationSafe } from '@/components';
import { clsx } from 'clsx';

type GenerateBeatButtonProps = {
	isGenerating: boolean;
};

export function GenerateBeatButton({ isGenerating }: GenerateBeatButtonProps) {
	const title = isGenerating ? 'Generating…' : 'Generate Beat';

	return (
		<HydrationSafe
			fallback={
				<Button type='submit' variant='generate' title='Loading…' disabled>
					<FontAwesomeIcon
						icon={faRefresh}
						className='h-5 w-5'
						style={{ width: '1.25rem', height: '1.25rem' }}
					/>
				</Button>
			}
		>
			<Button
				type='submit'
				componentName='GenerateBeatButton'
				variant='generate'
				title={title}
				isDisabled={isGenerating}
			>
				<FontAwesomeIcon
					icon={faRefresh}
					className={clsx('h-5 w-5', { 'animate-spin': isGenerating })}
					style={{ width: '1.25rem', height: '1.25rem' }}
				/>
			</Button>
		</HydrationSafe>
	);
}
