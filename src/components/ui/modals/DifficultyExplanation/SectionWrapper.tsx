import type { ReactNode } from 'react';

type SectionWrapperProps = {
	children: ReactNode;
	title?: string;
	ariaLabel?: string;
	ariaLabelledBy?: string;
	className?: string;
	role?: string;
};

export function SectionWrapper({
	children,
	title,
	ariaLabel,
	ariaLabelledBy,
	className = '',
	role = 'region',
}: SectionWrapperProps) {
	return (
		<section
			className={`SectionWrapper flex flex-col gap-4 ${className}`}
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
		</section>
	);
}
