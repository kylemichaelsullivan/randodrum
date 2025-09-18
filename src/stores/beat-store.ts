import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BeatStore, GeneratedBeat } from '@/types';

export const useBeatStore = create<BeatStore>()(
	persist(
		set => ({
			currentBeat: null,
			isLoading: false,
			setCurrentBeat: (beat: GeneratedBeat) => set({ currentBeat: beat }),
			setIsLoading: (loading: boolean) => set({ isLoading: loading }),
			clearBeat: () => set({ currentBeat: null }),
			clearCorruptedBeat: () => {
				console.log('Clearing corrupted beat data');
				localStorage.removeItem('beat-storage');
				set({ currentBeat: null });
			},
		}),
		{
			name: 'beat-storage',
		}
	)
);
