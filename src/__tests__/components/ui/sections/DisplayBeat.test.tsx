import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@/__tests__/utils';
import { DisplayBeat } from '@/components/ui/sections/DisplayBeat';
import { mockGeneratedBeat } from '@/__tests__/fixtures';
import { useBeatStore } from '@/stores/beat-store';

// Mock the beat store
vi.mock('@/stores/beat-store', () => ({
	useBeatStore: vi.fn(),
}));

// Mock the hydration boundary
vi.mock('@/components/providers/hydration-boundary', () => ({
	ClientOnly: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('DisplayBeat', () => {
	const mockUseBeatStore = vi.mocked(useBeatStore);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders empty state when no beat is available', () => {
		mockUseBeatStore.mockReturnValue({
			currentBeat: null,
			setCurrentBeat: vi.fn(),
		} as any);

		render(<DisplayBeat />);

		expect(screen.getByText('Use the form above to create a beat!')).toBeInTheDocument();
	});

	it('renders beat display when beat is available', () => {
		mockUseBeatStore.mockReturnValue({
			currentBeat: mockGeneratedBeat,
			setCurrentBeat: vi.fn(),
		} as any);

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
			setCurrentBeat: vi.fn(),
		} as any);

		render(<DisplayBeat />);

		// Should render 4 measures (from mockGeneratedBeat)
		const measureElements = screen.getAllByText(/Measure \d+/);
		expect(measureElements).toHaveLength(4);
	});

	it('applies correct styling classes', () => {
		mockUseBeatStore.mockReturnValue({
			currentBeat: mockGeneratedBeat,
			setCurrentBeat: vi.fn(),
		} as any);

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
			'p-6',
			'font-musisync'
		);
	});
});
