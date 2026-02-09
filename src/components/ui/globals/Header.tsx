'use client';

import { DisplaySize, ThemeToggle } from '@/components';

export function Header() {
	return (
		<header className='Header flex items-center justify-between border-b border-black p-1'>
			<DisplaySize />
			<h1 className='text-2xl font-bold'>RandoDrum</h1>
			<ThemeToggle />
		</header>
	);
}
