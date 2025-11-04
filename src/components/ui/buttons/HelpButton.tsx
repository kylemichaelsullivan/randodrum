'use client';

import { useState } from 'react';

import { Button } from './Button';
import { DifficultyExplanation, Modal } from '@/components';

type HelpButtonProps = {
	className?: string;
	title?: string;
};

export function HelpButton({
	className = 'absolute right-0 top-0',
	title = 'Help',
}: HelpButtonProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<Button
				className={`${className}`}
				variant='help'
				componentName='HelpButton'
				title={title}
				aria-label='Show difficulty explanation'
				onClick={() => setIsModalOpen(true)}
			>
				<span className='text-xs font-medium'>?</span>
			</Button>

			<Modal
				title='Difficulty Levels Explained'
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			>
				<DifficultyExplanation />
			</Modal>
		</>
	);
}
