/**
 * Store and state management types
 */

import type { BeatFormData, GeneratedBeat } from './beat';
import type { DominantHand } from './ui';

// Beat store type
export type BeatStore = {
	currentBeat: GeneratedBeat | null;
	isLoading: boolean;
	setCurrentBeat: (beat: GeneratedBeat) => void;
	setIsLoading: (loading: boolean) => void;
	clearBeat: () => void;
	clearCorruptedBeat: () => void;
};

// Dominant hand context type
export type DominantHandContextType = {
	dominantHand: DominantHand;
	isHydrated: boolean;
	setDominantHand: (hand: DominantHand) => void;
	toggleDominantHand: () => void;
};

// Form store type
export type FormStore = {
	formValues: BeatFormData;
	resetFormValues: () => void;
	setFormValues: (values: Partial<BeatFormData>) => void;
};
