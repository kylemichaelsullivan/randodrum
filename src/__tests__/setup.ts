import '@testing-library/jest-dom';
import { vi } from 'vitest';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

// Mock Next.js router
vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		prefetch: vi.fn(),
		back: vi.fn(),
		forward: vi.fn(),
		refresh: vi.fn(),
	}),
	useSearchParams: () => ({
		get: vi.fn(),
	}),
	usePathname: () => '/',
}));

// Mock FontAwesome
vi.mock('@fortawesome/react-fontawesome', () => ({
	FontAwesomeIcon: ({ icon }: { icon: IconProp }) => {
		const React = require('react');
		const iconName =
			typeof icon === 'string' ? icon
			: Array.isArray(icon) ? icon[0]
			: icon?.iconName || 'icon';
		return React.createElement('span', { 'data-testid': 'font-awesome-icon' }, iconName);
	},
}));

// Mock tRPC
vi.mock('@/trpc', () => ({
	api: {
		beat: {
			generate: {
				useMutation: () => ({
					mutate: vi.fn(),
					isLoading: false,
					error: null,
				}),
			},
		},
	},
}));

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation(query => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});
