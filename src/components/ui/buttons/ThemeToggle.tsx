'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { Button } from './Button';
import { HydrationSafe, useTheme } from '@/components';

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();

	const isDark = theme === 'dark';
	const title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
	const icon = isDark ? faMoon : faLightbulb;
	const size = 'w-5 h-5';

	return (
		<HydrationSafe
			fallback={
				<Button
					variant='icon'
					className='bg-gray'
					title='Loading theme…'
					disabled
				>
					<FontAwesomeIcon
						icon={faLightbulb}
						className={`text-white ${size}`}
						style={{ width: '1.25rem', height: '1.25rem' }}
					/>
				</Button>
			}
		>
			<Button
				variant='icon'
				className='bg-gray hover:opacity-60'
				componentName='ThemeToggle'
				title={title}
				onClick={toggleTheme}
			>
				<FontAwesomeIcon
					icon={icon}
					className={`text-white ${size}`}
					style={{ width: '1.25rem', height: '1.25rem' }}
				/>
			</Button>
		</HydrationSafe>
	);
}
