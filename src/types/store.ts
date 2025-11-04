/**
 * Store and state management types
 */

import type { BeatFormData, GeneratedBeat } from './beat';
import type { Sticking } from './ui';

export type BeatStore = {
	currentBeat: GeneratedBeat | null;
	isLoading: boolean;
	setCurrentBeat: (beat: GeneratedBeat) => void;
	setIsLoading: (loading: boolean) => void;
	clearBeat: () => void;
	clearCorruptedBeat: () => void;
};

export type StickingStore = {
	sticking: Sticking;
	isStickingHidden: boolean;
	isHydrated: boolean;
	setSticking: (hand: Sticking) => void;
	toggleSticking: () => void;
	hideSticking: () => void;
};

export type DisplayStore = {
	displaySize: number;
	setDisplaySize: (size: number) => void;
	resetDisplaySize: () => void;
};

export type FormStore = {
	formValues: BeatFormData;
	resetFormValues: () => void;
	setFormValues: (values: Partial<BeatFormData>) => void;
};
