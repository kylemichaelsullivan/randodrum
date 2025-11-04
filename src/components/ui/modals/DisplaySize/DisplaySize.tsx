'use client';

import {
	DISPLAY_SIZE_MAX,
	DISPLAY_SIZE_MIN,
	DISPLAY_SIZE_STEP,
} from './constants';

import { DisplaySizeButtons } from './DisplaySizeButtons';
import { DisplaySizeRange } from './DisplaySizeRange';
import { Modal } from '@/components/ui/modals';
import { useDisplayMultiplier } from './useDisplayMultiplier';
import { useDisplayStore } from '@/stores';

import type { DisplayStore } from '@/types';

type DisplaySizeModalProps = {
	isModalOpen: boolean;
	onClose: () => void;
};

export function DisplaySizeModal({
	isModalOpen,
	onClose,
}: DisplaySizeModalProps) {
	const displaySize = useDisplayStore(
		(state: DisplayStore) => state.displaySize,
	);
	const setDisplaySize = useDisplayStore(
		(state: DisplayStore) => state.setDisplaySize,
	);

	useDisplayMultiplier(displaySize);

	const handleDecrease = () => {
		setDisplaySize(Math.max(DISPLAY_SIZE_MIN, displaySize - DISPLAY_SIZE_STEP));
	};

	const handleIncrease = () => {
		setDisplaySize(Math.min(DISPLAY_SIZE_MAX, displaySize + DISPLAY_SIZE_STEP));
	};

	return (
		<Modal title='Display Size' isOpen={isModalOpen} onClose={onClose}>
			<div className='DisplaySizeContent flex flex-col gap-4'>
				<DisplaySizeRange
					displaySize={displaySize}
					min={DISPLAY_SIZE_MIN}
					max={DISPLAY_SIZE_MAX}
					step={DISPLAY_SIZE_STEP}
					onChange={setDisplaySize}
				/>

				<DisplaySizeButtons
					onDecrease={handleDecrease}
					onIncrease={handleIncrease}
				/>
			</div>
		</Modal>
	);
}
