'use client';

import { forwardRef } from 'react';

import { clsx } from 'clsx';

import type { ButtonHTMLAttributes, MouseEvent, KeyboardEvent, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	title: string;
	children: ReactNode;
	variant?: 'default' | 'icon';
	'aria-label'?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			title,
			children,
			className = '',
			variant = 'default',
			'aria-label': ariaLabel,
			onClick,
			onKeyDown,
			...props
		},
		ref
	) => {
		const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onClick?.(e as unknown as MouseEvent<HTMLButtonElement>);
			}
			onKeyDown?.(e);
		};

		const baseStyles =
			'Button flex items-center justify-center transition-colors focus:ring-2 focus:ring-blue focus:outline-none';
		const iconStyles = 'bg-white border border-black rounded-lg w-10 h-10 hover:bg-light-gray';

		return (
			<button
				type={props.type ?? 'button'}
				className={clsx(baseStyles, variant === 'icon' && iconStyles, className)}
				role='button'
				aria-label={ariaLabel ?? title}
				title={title}
				tabIndex={0}
				onClick={onClick}
				onKeyDown={handleKeyDown}
				ref={ref}
				{...props}
			>
				{children}
			</button>
		);
	}
);

Button.displayName = 'Button';
