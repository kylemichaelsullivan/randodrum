'use client';

import { forwardRef, memo } from 'react';

import { clsx } from 'clsx';

import type { ButtonHTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	title: string;
	children: ReactNode;
	variant?: 'default' | 'icon' | 'generate' | 'help';
	'aria-label'?: string;
	isDisabled?: boolean;
}

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			title,
			children,
			className = '',
			variant = 'default',
			'aria-label': ariaLabel,
			isDisabled = false,
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
		const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed';
		const generateStyles =
			'bg-blue rounded-md text-white w-full max-w-sm px-4 py-2 transition-colors hover:bg-light-blue';
		const iconStyles = 'bg-white border border-black rounded-lg w-10 h-10 hover:bg-light-gray';
		const helpStyles =
			'bg-gray-100 border border-gray-300 rounded-full w-6 h-6 hover:bg-gray-200 text-gray-600 hover:text-gray-800';

		return (
			<button
				type={props.type ?? 'button'}
				className={clsx(
					baseStyles,
					variant === 'icon' && iconStyles,
					variant === 'generate' && generateStyles,
					variant === 'help' && helpStyles,
					disabledStyles,
					className
				)}
				role='button'
				aria-label={ariaLabel ?? title}
				title={title}
				tabIndex={0}
				onClick={onClick}
				onKeyDown={handleKeyDown}
				ref={ref}
				disabled={isDisabled || props.disabled}
				{...props}
			>
				{children}
			</button>
		);
	}
);

ButtonComponent.displayName = 'Button';

export const Button = memo(ButtonComponent);
