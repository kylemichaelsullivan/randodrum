'use client';

import { useEffect, useRef, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';

import { clsx } from 'clsx';

import type { ReactNode } from 'react';

type ModalProps = {
	title: string;
	isOpen: boolean;
	children: ReactNode;
	onClose: () => void;
	className?: string;
};

export function Modal({ title, isOpen, onClose, children, className = '' }: ModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleEscape = (e: Event) => {
			const keyboardEvent = e as KeyboardEvent;
			if (keyboardEvent.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose]);

	useEffect(() => {
		if (isOpen && modalRef.current) {
			modalRef.current.focus();
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const handleBackdropClick = (e: MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return createPortal(
		<div
			className='Modal fixed flex items-center justify-center backdrop-blur-sm inset-0 z-50'
			role='dialog'
			aria-modal='true'
			aria-labelledby='modal-title'
			onClick={handleBackdropClick}
		>
			<div
				className={clsx(
					'relative bg-white border border-black rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] mx-4 sm:mx-6 overflow-y-auto',
					className
				)}
				tabIndex={-1}
				ref={modalRef}
			>
				<div className='flex justify-between items-center border-b border-black p-4 sm:p-6'>
					<h2 className='text-black text-lg sm:text-xl font-semibold' id='modal-title'>
						{title}
					</h2>
					<button
						type='button'
						className='text-gray rounded hover:text-black focus:outline-none focus:ring-2 focus:ring-blue p-1'
						aria-label='Close modal'
						onClick={onClose}
					>
						<span className='text-xl sm:text-2xl'>&times;</span>
					</button>
				</div>
				<div className='p-4 sm:p-6'>{children}</div>
			</div>
		</div>,
		document.body
	);
}
