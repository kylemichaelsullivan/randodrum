import { render, type RenderOptions } from '@testing-library/react';
import { DominantHandProvider } from '@/components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components';
import type { ReactElement, ReactNode } from 'react';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: ReactNode }) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<DominantHandProvider>{children}</DominantHandProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
	render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
