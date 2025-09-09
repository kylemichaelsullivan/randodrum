'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../providers/theme-provider';
import { Button } from './Button';

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === 'dark';
	const title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
	const icon = isDark ? faMoon : faLightbulb;

	return (
		<Button variant='icon' title={title} onClick={toggleTheme}>
			<FontAwesomeIcon icon={icon} className='text-black w-5 h-5' />
		</Button>
	);
}
