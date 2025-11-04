import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { DisplayStore } from '@/types';

export const defaultDisplaySize = 100;

export const useDisplayStore = create<DisplayStore>()(
	persist(
		(set) => ({
			displaySize: defaultDisplaySize,
			setDisplaySize: (size: number) => set({ displaySize: size }),
			resetDisplaySize: () => set({ displaySize: defaultDisplaySize }),
		}),
		{
			name: 'display-storage',
		},
	),
);
