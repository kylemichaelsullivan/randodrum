'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type DominantHand = 'left' | 'right';

type DominantHandContextType = {
	dominantHand: DominantHand;
	setDominantHand: (hand: DominantHand) => void;
	toggleDominantHand: () => void;
};

const DominantHandContext = createContext<DominantHandContextType | undefined>(undefined);

export function DominantHandProvider({ children }: { children: React.ReactNode }) {
	const [dominantHand, setDominantHandState] = useState<DominantHand>('right');
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const savedHand = localStorage.getItem('dominantHand') as DominantHand;
		const initialHand = savedHand || 'right';
		setDominantHandState(initialHand);
	}, []);

	const setDominantHand = (newHand: DominantHand) => {
		setDominantHandState(newHand);
		localStorage.setItem('dominantHand', newHand);
	};

	const toggleDominantHand = () => {
		const newHand = dominantHand === 'left' ? 'right' : 'left';
		setDominantHand(newHand);
	};

	// Prevent hydration mismatch by not rendering until mounted
	if (!mounted) {
		return (
			<DominantHandContext.Provider
				value={{ dominantHand: 'right', setDominantHand, toggleDominantHand }}
			>
				{children}
			</DominantHandContext.Provider>
		);
	}

	return (
		<DominantHandContext.Provider value={{ dominantHand, setDominantHand, toggleDominantHand }}>
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
