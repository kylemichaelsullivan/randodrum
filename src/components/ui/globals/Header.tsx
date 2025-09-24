'use client';

import { DominantHand, ThemeToggle } from '@/components';

export function Header() {
	return (
		<header className='Header flex justify-between items-center border-b border-black p-1'>
			<DominantHand />
			<h1 className='text-2xl font-bold'>RandoDrum</h1>
			<ThemeToggle />
		</header>
	);
}
