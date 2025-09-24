import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DisplayBeat } from '@/components';
import { mockGeneratedBeat, render, screen } from '@/__tests__';
import { useBeatStore } from '@/stores';

import type { ReactNode } from 'react';
import type { BeatStore } from '@/types';

// Mock the beat store
vi.mock('@/stores', () => ({
	useBeatStore: vi.fn(),
}));

// Mock the hydration boundary
vi.mock('@/components/providers/hydration-boundary', () => ({
	ClientOnly: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

describe('DisplayBeat', () => {
	const mockUseBeatStore = vi.mocked(useBeatStore);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders empty state when no beat is available', () => {
		mockUseBeatStore.mockReturnValue({
			currentBeat: null,
			isLoading: false,
			setCurrentBeat: vi.fn(),
			setIsLoading: vi.fn(),
			clearBeat: vi.fn(),
			clearCorruptedBeat: vi.fn(),
		} as BeatStore);

		render(<DisplayBeat />);

		expect(screen.getByText('Use the form above to create a beat!')).toBeInTheDocument();
	});

	it('renders beat display when beat is available', () => {
		mockUseBeatStore.mockReturnValue({
			currentBeat: mockGeneratedBeat,
			isLoading: false,
			setCurrentBeat: vi.fn(),
			setIsLoading: vi.fn(),
			clearBeat: vi.fn(),
			clearCorruptedBeat: vi.fn(),
		} as BeatStore);

		render(<DisplayBeat />);

		// Should render the beat display container
		const displayContainer = screen.getByText('- Right Hand').closest('.DisplayBeat');
		expect(displayContainer).toBeInTheDocument();

		// Should render hand legend
		expect(screen.getByText('- Right Hand')).toBeInTheDocument();
		expect(screen.getByText('- Left Hand')).toBeInTheDocument();
	});

	it('renders correct number of measures', () => {
		mockUseBeatStore.mockReturnValue({
			currentBeat: mockGeneratedBeat,
			isLoading: false,
			setCurrentBeat: vi.fn(),
			setIsLoading: vi.fn(),
			clearBeat: vi.fn(),
			clearCorruptedBeat: vi.fn(),
		} as BeatStore);

		render(<DisplayBeat />);

		// Should render 4 measures (from mockGeneratedBeat)
		const measureElements = screen.getAllByText(/Measure \d+/);
		expect(measureElements).toHaveLength(4);
	});

	it('applies correct styling classes', () => {
		mockUseBeatStore.mockReturnValue({
			currentBeat: mockGeneratedBeat,
			isLoading: false,
			setCurrentBeat: vi.fn(),
			setIsLoading: vi.fn(),
			clearBeat: vi.fn(),
			clearCorruptedBeat: vi.fn(),
		} as BeatStore);

		render(<DisplayBeat />);

		const displayContainer = screen.getByText('- Right Hand').closest('.DisplayBeat');
		expect(displayContainer).toHaveClass(
			'DisplayBeat',
			'flex',
			'flex-col',
			'gap-4',
			'bg-white',
			'border',
			'border-light-gray',
			'rounded-lg',
			'shadow-sm',
			'w-full',
			'p-6'
		);
	});
});
