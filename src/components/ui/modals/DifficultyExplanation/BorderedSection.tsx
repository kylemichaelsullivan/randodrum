import type { ReactNode } from 'react';

type BorderedSectionProps = {
	children: ReactNode;
	title?: string;
	ariaLabel?: string;
	ariaLabelledBy?: string;
	className?: string;
	role?: string;
};

export function BorderedSection({
	children,
	title,
	ariaLabel,
	ariaLabelledBy,
	className = '',
	role = 'region',
}: BorderedSectionProps) {
	return (
		<div
			className={`BorderedSection flex flex-col gap-4 bg-light-gray border border-black rounded-lg p-3 sm:p-4 ${className}`}
			role={role}
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledBy}
		>
			{title && (
				<h3 className='text-black text-base font-semibold sm:text-lg' id={ariaLabelledBy}>
					{title}
				</h3>
			)}
			{children}
		</div>
	);
}
