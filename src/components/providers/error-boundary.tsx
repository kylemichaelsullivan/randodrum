'use client';

import { Component, type ReactNode } from 'react';

type ErrorBoundaryState = {
	hasError: boolean;
	error?: Error;
};

type ErrorBoundaryProps = {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: { componentStack: string }) => void;
};

// This has to be a class component to access lifecycle methods
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
		this.props.onError?.(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback ?? (
					<div className='flex items-center justify-center bg-red border border-red rounded-lg p-8'>
						<div className='text-center'>
							<h3 className='text-white text-lg font-semibold pb-2'>Something went wrong</h3>
							<p className='text-white pb-4'>
								{this.state.error?.message ?? 'An unexpected error occurred'}
							</p>
							<button
								className='bg-red text-white rounded px-4 py-2 transition-colors hover:bg-red'
								onClick={() => this.setState({ hasError: false, error: undefined })}
							>
								Try again
							</button>
						</div>
					</div>
				)
			);
		}

		return this.props.children;
	}
}

/**
 * HydrationErrorBoundary specifically handles hydration-related errors
 * and provides graceful fallbacks for browser extension interference
 */
export function HydrationErrorBoundary({ children }: { children: ReactNode }) {
	return (
		<ErrorBoundary
			onError={error => {
				if (error.message.includes('hydration') || error.message.includes('Hydration')) {
					// Check if it's a browser extension issue
					if (
						error.message.includes('cz-shortcut-listen') ||
						error.message.includes('browser extension') ||
						error.stack?.includes('body')
					) {
						console.warn(
							'Browser extension hydration interference detected and handled:',
							error.message
						);
					} else {
						console.warn('Hydration error caught and handled:', error.message);
					}
				}
			}}
			fallback={
				<div className='flex items-center justify-center p-8 border border-gray rounded-lg bg-light-gray'>
					<div className='text-center'>
						<h3 className='text-lg font-semibold text-black pb-2'>Loading…</h3>
						<p className='text-gray'>The page is loading. Please wait a moment.</p>
					</div>
				</div>
			}
		>
			{children}
		</ErrorBoundary>
	);
}
