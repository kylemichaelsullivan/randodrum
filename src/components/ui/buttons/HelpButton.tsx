'use client';

import { useState } from 'react';

import { Button } from './Button';
import { DifficultyExplanation } from '../modals/DifficultyExplanation';
import { Modal } from '../modals';

type HelpButtonProps = {
	className?: string;
	title?: string;
};

export function HelpButton({ title = 'Help', className = '' }: HelpButtonProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<Button
				className={`HelpButton ${className}`}
				variant='help'
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
