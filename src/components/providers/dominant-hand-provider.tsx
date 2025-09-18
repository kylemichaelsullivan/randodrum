'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { DominantHand, DominantHandContextType } from '@/types';

const DominantHandContext = createContext<DominantHandContextType | undefined>(undefined);

export function DominantHandProvider({ children }: { children: ReactNode }) {
	const [dominantHand, setDominantHandState] = useState<DominantHand>('right');
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		const savedHand = localStorage.getItem('dominantHand') as DominantHand;
		const initialHand = savedHand || 'right';
		setDominantHandState(initialHand);
		setIsHydrated(true);
	}, []);

	const setDominantHand = (newHand: DominantHand) => {
		setDominantHandState(newHand);
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('dominantHand', newHand);
		}
	};

	const toggleDominantHand = () => {
		const newHand = dominantHand === 'left' ? 'right' : 'left';
		setDominantHand(newHand);
	};

	return (
		<DominantHandContext.Provider
			value={{ dominantHand, setDominantHand, toggleDominantHand, isHydrated }}
		>
			{children}
		</DominantHandContext.Provider>
	);
}

export function useDominantHand() {
	const context = useContext(DominantHandContext);
	if (context === undefined) {
		throw new Error('useDominantHand must be used within a DominantHandProvider');
	}
	return context;
}
