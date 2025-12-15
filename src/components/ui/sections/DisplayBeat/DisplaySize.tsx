'use client';

import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

import { Button } from '@/components/ui/buttons';
import { DisplaySizeModal, useDisplayMultiplier } from '@/components/ui/modals';
import { useBeatStore, useDisplayStore } from '@/stores';

import type { DisplayStore } from '@/types';

export function DisplaySize() {
	const { currentBeat } = useBeatStore();
	const displaySize = useDisplayStore(
		(state: DisplayStore) => state.displaySize,
	);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useDisplayMultiplier(displaySize);

	if (!currentBeat) {
		return null;
	}

	return (
		<>
			<Button
				variant='icon'
				componentName='DisplaySize'
				className='bg-light-gray hover:opacity-60'
				title='Display Size'
				onClick={() => setIsModalOpen(true)}
			>
				<FontAwesomeIcon
					icon={faEye}
					className='text-black'
					style={{ width: '1.25rem', height: '1.25rem' }}
				/>
			</Button>

			<DisplaySizeModal
				isModalOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
}
