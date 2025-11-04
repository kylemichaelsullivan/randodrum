'use client';

import {
	faMagnifyingGlassMinus,
	faMagnifyingGlassPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from '@/components/ui/buttons';

type DisplaySizeButtonsProps = {
	onDecrease: () => void;
	onIncrease: () => void;
};

export function DisplaySizeButtons({
	onDecrease,
	onIncrease,
}: DisplaySizeButtonsProps) {
	const buttonClassName = 'bg-gray text-white hover:opacity-60';

	return (
		<div className='flex justify-between'>
			<Button
				variant='icon'
				className={buttonClassName}
				title='Decrease Size'
				onClick={onDecrease}
			>
				<FontAwesomeIcon icon={faMagnifyingGlassMinus} />
			</Button>

			<Button
				variant='icon'
				className={buttonClassName}
				title='Increase Size'
				onClick={onIncrease}
			>
				<FontAwesomeIcon icon={faMagnifyingGlassPlus} />
			</Button>
		</div>
	);
}
