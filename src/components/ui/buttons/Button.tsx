'use client';

import { forwardRef } from 'react';

import { clsx } from 'clsx';
import { createMemoizedComponent } from '@/utils';

import type {
	ButtonHTMLAttributes,
	KeyboardEvent,
	MouseEvent,
	ReactNode,
} from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	title: string;
	children: ReactNode;
	variant?: 'default' | 'icon' | 'generate' | 'help' | 'hidden';
	'aria-label'?: string;
	componentName?: string;
	isDisabled?: boolean;
}

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
	function ButtonComponent(
		{
			title,
			children,
			className = '',
			variant = 'default',
			'aria-label': ariaLabel,
			componentName,
			isDisabled = false,
			onClick,
			onKeyDown,
			...props
		},
		ref,
	) {
		const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onClick?.(e as unknown as MouseEvent<HTMLButtonElement>);
			}
			onKeyDown?.(e);
		};

		const buttonComponentName = componentName
			? componentName
					.split(' ')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' ')
			: 'Button';

		const baseStyles =
			'flex items-center justify-center transition-colors focus:ring-2 focus:ring-blue focus:outline-none';
		const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed';
		const generateStyles =
			'bg-blue rounded-md text-white w-full max-w-sm px-4 py-2 transition-colors hover:bg-light-blue';
		const iconStyles = 'bg-white border border-black rounded-lg w-10 h-10';
		const helpStyles =
			'bg-gray-100 border border-gray-300 rounded-full w-6 h-6 hover:bg-gray-200 text-gray-600 hover:text-gray-800';
		const hiddenStyles = 'invisible';

		return (
			<button
				type={props.type ?? 'button'}
				className={clsx(
					buttonComponentName,
					baseStyles,
					variant === 'icon' && iconStyles,
					variant === 'generate' && generateStyles,
					variant === 'help' && helpStyles,
					variant === 'hidden' && hiddenStyles,
					disabledStyles,
					className,
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
	},
);

export const Button = createMemoizedComponent(ButtonComponent, 'Button');
