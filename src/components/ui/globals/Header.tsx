'use client';

import { DominantHand, ThemeToggle, HydrationSafe } from '@/components';

export function Header() {
	return (
		<header className='Header flex justify-between items-center border-b border-black p-1'>
			<HydrationSafe fallback={<div className='w-10 h-10' />}>
				<DominantHand />
			</HydrationSafe>
			<h1 className='text-2xl font-bold'>RandoDrum</h1>
			<ThemeToggle />
		</header>
	);
}
