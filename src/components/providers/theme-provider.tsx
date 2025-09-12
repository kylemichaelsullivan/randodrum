'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
	isHydrated: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>('light');
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') as Theme;
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

		setThemeState(initialTheme);
		updateTheme(initialTheme);
		setIsHydrated(true);
	}, []);

	const updateTheme = (newTheme: Theme) => {
		if (typeof document !== 'undefined') {
			if (newTheme === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('theme', newTheme);
		}
	};

	const setTheme = (newTheme: Theme) => {
		setThemeState(newTheme);
		updateTheme(newTheme);
	};

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
	};

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isHydrated }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
