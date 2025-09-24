'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';

import { Button } from '@/components';
import { clsx } from 'clsx';

type GenerateBeatButtonProps = {
	isGenerating: boolean;
};

export function GenerateBeatButton({ isGenerating }: GenerateBeatButtonProps) {
	const title = isGenerating ? 'Generating…' : 'Generate Beat';

	return (
		<Button type='submit' variant='generate' title={title} isDisabled={isGenerating}>
			<FontAwesomeIcon
				icon={faRefresh}
				className={clsx('w-5 h-5', { 'animate-spin': isGenerating })}
			/>
		</Button>
	);
}
