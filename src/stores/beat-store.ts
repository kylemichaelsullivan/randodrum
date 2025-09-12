import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GeneratedBeat } from '@/types';

type BeatStore = {
	currentBeat: GeneratedBeat | null;
	setCurrentBeat: (beat: GeneratedBeat) => void;
	clearBeat: () => void;
};

export const useBeatStore = create<BeatStore>()(
	persist(
		set => ({
			currentBeat: null,
			setCurrentBeat: (beat: GeneratedBeat) => set({ currentBeat: beat }),
			clearBeat: () => set({ currentBeat: null }),
		}),
		{
			name: 'beat-storage',
		}
	)
);
