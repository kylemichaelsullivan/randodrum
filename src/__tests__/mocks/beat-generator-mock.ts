import { vi } from 'vitest';
import type { GeneratedBeat, BeatFormData } from '@/types';
import { mockGeneratedBeat } from '../fixtures';

export const mockBeatGenerator = {
	generateBeat: vi.fn().mockResolvedValue(mockGeneratedBeat),
	validateFormData: vi.fn().mockReturnValue(true),
	calculateDifficulty: vi.fn().mockReturnValue(1),
};

export const mockBeatGeneratorError = {
	generateBeat: vi.fn().mockRejectedValue(new Error('Beat generation failed')),
	validateFormData: vi.fn().mockReturnValue(false),
	calculateDifficulty: vi.fn().mockReturnValue(0),
};
