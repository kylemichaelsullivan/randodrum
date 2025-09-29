/**
 * Store and state management types
 */

import type { BeatFormData, GeneratedBeat } from './beat';
import type { DominantHand } from './ui';

export type BeatStore = {
	currentBeat: GeneratedBeat | null;
	isLoading: boolean;
	setCurrentBeat: (beat: GeneratedBeat) => void;
	setIsLoading: (loading: boolean) => void;
	clearBeat: () => void;
	clearCorruptedBeat: () => void;
};

export type DominantHandContextType = {
	dominantHand: DominantHand;
	isHydrated: boolean;
	setDominantHand: (hand: DominantHand) => void;
	toggleDominantHand: () => void;
};

export type FormStore = {
	formValues: BeatFormData;
	resetFormValues: () => void;
	setFormValues: (values: Partial<BeatFormData>) => void;
};
