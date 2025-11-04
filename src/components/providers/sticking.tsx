'use client';

import {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from 'react';
import type { Sticking, StickingStore } from '@/types';

const StickingContext = createContext<StickingStore | undefined>(undefined);

export function StickingProvider({ children }: { children: ReactNode }) {
	const [sticking, setStickingState] = useState<Sticking>('right');
	const [isStickingHidden, setIsStickingHidden] = useState(false);
	const [isHydrated, setIsHydrated] = useState(false);
	const toggleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const stickingRef = useRef<Sticking>('right');
	const isStickingHiddenRef = useRef(false);

	useEffect(() => {
		const savedHand = localStorage.getItem('sticking') as Sticking;
		const initialHand = savedHand || 'right';
		setStickingState(initialHand);
		stickingRef.current = initialHand;
		setIsHydrated(true);
	}, []);

	useEffect(() => {
		return () => {
			if (toggleTimeoutRef.current) {
				clearTimeout(toggleTimeoutRef.current);
			}
		};
	}, []);

	const setSticking = (newHand: Sticking) => {
		setStickingState(newHand);
		setIsStickingHidden(false);
		stickingRef.current = newHand;
		isStickingHiddenRef.current = false;

		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('sticking', newHand);
		}
	};

	const toggleSticking = () => {
		if (toggleTimeoutRef.current) {
			clearTimeout(toggleTimeoutRef.current);
		}

		toggleTimeoutRef.current = setTimeout(() => {
			if (isStickingHiddenRef.current) {
				setSticking(stickingRef.current ?? 'right');
			} else {
				const newHand = stickingRef.current === 'left' ? 'right' : 'left';
				setSticking(newHand);
			}
			toggleTimeoutRef.current = null;
		}, 300);
	};

	const hideSticking = () => {
		if (toggleTimeoutRef.current) {
			clearTimeout(toggleTimeoutRef.current);
			toggleTimeoutRef.current = null;
		}
		setIsStickingHidden((prev) => {
			const newValue = !prev;
			isStickingHiddenRef.current = newValue;
			return newValue;
		});
	};

	return (
		<StickingContext.Provider
			value={{
				sticking,
				setSticking,
				toggleSticking,
				hideSticking,
				isStickingHidden,
				isHydrated,
			}}
		>
			{children}
		</StickingContext.Provider>
	);
}

export function useSticking() {
	const context = useContext(StickingContext);
	if (context === undefined) {
		throw new Error('useSticking must be used within a StickingProvider');
	}
	return context;
}
